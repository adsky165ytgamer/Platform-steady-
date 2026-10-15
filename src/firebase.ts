import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  collection,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export { onAuthStateChanged, type User };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot (CRITICAL CONSTRAINT)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    }
  }
}

testConnection();

// Sign In with Google popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Register with Email and Password and optional Username
export async function registerWithEmail(
  email: string,
  pass: string,
  username: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  const user = cred.user;

  // Update auth display name
  const cleanUsername = username.trim() || email.split('@')[0];
  await updateProfile(user, { displayName: cleanUsername });

  // Initialize Firestore user profile
  const userDocRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  const profileData: UserProfileData = {
    id: user.uid,
    username: cleanUsername,
    displayName: cleanUsername,
    email: user.email || email,
    photoURL: '',
    completedLessons: [],
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(userDocRef, profileData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
  }

  return user;
}

// Login with Email and Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

// Sign Out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}

export interface UserProfileData {
  id: string;
  username?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  completedLessons: string[];
  createdAt: string;
  updatedAt: string;
}

// Fetch user profile from Firestore
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const userDocRef = doc(db, 'users', userId);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}`);
  }
}

// Sync progress with Firestore: merges local progress and ensures /users/{uid} and /users/{uid}/progress/{lessonId} are up to date
export async function syncUserProgress(
  user: User,
  localCompletedLessons: string[],
  preferredUsername?: string
): Promise<{ mergedCompleted: string[]; profile: UserProfileData }> {
  const userDocRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  const now = new Date().toISOString();

  let existingDoc;
  try {
    existingDoc = await getDoc(userDocRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }

  let finalUsername = preferredUsername || user.displayName || user.email?.split('@')[0] || 'Architect';
  let mergedCompleted = localCompletedLessons;
  let createdAt = now;

  if (existingDoc && existingDoc.exists()) {
    const data = existingDoc.data() as UserProfileData;
    const remoteCompleted = Array.isArray(data.completedLessons) ? data.completedLessons : [];
    mergedCompleted = Array.from(new Set([...remoteCompleted, ...localCompletedLessons]));
    finalUsername = data.username || preferredUsername || data.displayName || finalUsername;
    createdAt = data.createdAt || now;

    const updatedProfile: UserProfileData = {
      id: user.uid,
      username: finalUsername,
      displayName: user.displayName || finalUsername,
      email: user.email || '',
      photoURL: user.photoURL || '',
      completedLessons: mergedCompleted,
      createdAt,
      updatedAt: now,
    };

    try {
      await setDoc(userDocRef, updatedProfile, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }

    // Sync subcollections for progress records
    for (const lessonId of mergedCompleted) {
      const progressRef = doc(db, 'users', user.uid, 'progress', lessonId);
      try {
        await setDoc(
          progressRef,
          {
            lessonId,
            completed: 'true',
            completedAt: now,
            synced: 'true',
          },
          { merge: true }
        );
      } catch (e) {
        // Log silently
      }
    }

    return { mergedCompleted, profile: updatedProfile };
  } else {
    // First time setup
    const initialProfile: UserProfileData = {
      id: user.uid,
      username: finalUsername,
      displayName: user.displayName || finalUsername,
      email: user.email || '',
      photoURL: user.photoURL || '',
      completedLessons: localCompletedLessons,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(userDocRef, initialProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }

    for (const lessonId of localCompletedLessons) {
      const progressRef = doc(db, 'users', user.uid, 'progress', lessonId);
      try {
        await setDoc(progressRef, {
          lessonId,
          completed: 'true',
          completedAt: now,
          synced: 'true',
        });
      } catch (e) {
        // Log silently
      }
    }

    return { mergedCompleted: localCompletedLessons, profile: initialProfile };
  }
}

// Update completed lessons in Firestore for signed-in user
export async function saveUserCompletedLessons(
  user: User,
  completedLessons: string[],
  username?: string
): Promise<void> {
  const userDocRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  const now = new Date().toISOString();

  try {
    await setDoc(
      userDocRef,
      {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || username || '',
        ...(username ? { username } : {}),
        completedLessons,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }

  // Update subcollection progress entries
  for (const lessonId of completedLessons) {
    const progressRef = doc(db, 'users', user.uid, 'progress', lessonId);
    try {
      await setDoc(
        progressRef,
        {
          lessonId,
          completed: 'true',
          completedAt: now,
          synced: 'true',
        },
        { merge: true }
      );
    } catch (e) {
      // Ignore subcollection error
    }
  }
}
