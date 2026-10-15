package com.platformsteady.service

import com.platformsteady.model.LessonProgress
import com.platformsteady.model.UserProfile
import dev.gitlive.firebase.Firebase
import dev.gitlive.firebase.auth.FirebaseAuth
import dev.gitlive.firebase.auth.auth
import dev.gitlive.firebase.firestore.FirebaseFirestore
import dev.gitlive.firebase.firestore.firestore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.datetime.Clock

/**
 * Modern KMP Firebase Synchronization Service
 * Handles offline caching, reactive state, and subcollection synchronization
 */
class FirebaseSyncService(
    private val auth: FirebaseAuth = Firebase.auth,
    private val firestore: FirebaseFirestore = Firebase.firestore
) {

    init {
        // Enable local offline persistence caching
        // Ensures instant load times when offline and automatic background sync on reconnect
        try {
            firestore.setSettings(persistenceEnabled = true)
        } catch (e: Exception) {
            println("Local persistence initialized or already configured: ${e.message}")
        }
    }

    /**
     * Get real-time User Profile from /users/{uid}
     */
    fun getUserProfile(uid: String): Flow<UserProfile?> {
        return firestore.collection("users")
            .document(uid)
            .snapshots
            .map { snapshot ->
                if (snapshot.exists) {
                    snapshot.data<UserProfile>()
                } else {
                    null
                }
            }
    }

    /**
     * Sync user progress both in document array and subcollection
     */
    suspend fun recordLessonCompletion(
        uid: String,
        lessonId: String,
        completed: Boolean,
        currentCompletedLessons: List<String>,
        username: String = ""
    ) {
        val now = Clock.System.now().toEpochMilliseconds()
        val updatedList = if (completed) {
            (currentCompletedLessons + lessonId).distinct()
        } else {
            currentCompletedLessons.filter { it != lessonId }
        }

        // 1. Update /users/{uid} root document
        val userRef = firestore.collection("users").document(uid)
        userRef.set(
            mapOf(
                "id" to uid,
                "username" to username,
                "completedLessons" to updatedList,
                "updatedAt" to now
            ),
            merge = true
        )

        // 2. Update subcollection /users/{uid}/progress/{lessonId}
        val progressRef = firestore.collection("users")
            .document(uid)
            .collection("progress")
            .document(lessonId)

        val progressEntry = LessonProgress(
            lessonId = lessonId,
            completed = completed,
            completedAt = now,
            synced = true
        )

        progressRef.set(progressEntry, merge = true)
    }

    /**
     * Observe subcollection /users/{uid}/progress in real-time
     */
    fun observeProgressSubcollection(uid: String): Flow<List<LessonProgress>> {
        return firestore.collection("users")
            .document(uid)
            .collection("progress")
            .snapshots
            .map { querySnapshot ->
                querySnapshot.documents.map { doc ->
                    doc.data<LessonProgress>()
                }
            }
    }
}
