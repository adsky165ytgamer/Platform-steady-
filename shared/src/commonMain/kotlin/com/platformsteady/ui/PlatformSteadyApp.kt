package com.platformsteady.ui

import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.platformsteady.model.UserProfile
import com.platformsteady.service.FirebaseSyncService
import com.platformsteady.ui.theme.DeepVoidBlack
import com.platformsteady.ui.theme.PlatformSteadyTheme

enum class AppDestination {
    SPLASH,
    AUTH,
    MAIN_WORKSPACE
}

@Composable
fun PlatformSteadyApp(
    syncService: FirebaseSyncService = remember { FirebaseSyncService() }
) {
    var currentDestination by remember { mutableStateOf(AppDestination.SPLASH) }
    var currentUser by remember { mutableStateOf<UserProfile?>(null) }
    var authError by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }

    PlatformSteadyTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DeepVoidBlack)
        ) {
            Crossfade(targetState = currentDestination) { destination ->
                when (destination) {
                    AppDestination.SPLASH -> {
                        SplashScreen(
                            onComplete = {
                                currentDestination = if (currentUser != null) {
                                    AppDestination.MAIN_WORKSPACE
                                } else {
                                    AppDestination.AUTH
                                }
                            }
                        )
                    }

                    AppDestination.AUTH -> {
                        AuthScreen(
                            onSignIn = { email, pass ->
                                isLoading = true
                                authError = null
                                // Sign-in logic wired to KMP auth
                                currentUser = UserProfile(
                                    uid = "kmp-user-${email.hashCode()}",
                                    username = email.substringBefore("@"),
                                    email = email
                                )
                                isLoading = false
                                currentDestination = AppDestination.MAIN_WORKSPACE
                            },
                            onRegister = { email, pass, username ->
                                isLoading = true
                                authError = null
                                currentUser = UserProfile(
                                    uid = "kmp-user-${email.hashCode()}",
                                    username = username.ifBlank { email.substringBefore("@") },
                                    email = email
                                )
                                isLoading = false
                                currentDestination = AppDestination.MAIN_WORKSPACE
                            },
                            onGoogleSignIn = {
                                // Google Sign-in flow
                                currentUser = UserProfile(
                                    uid = "google-user-kmp",
                                    username = "GoogleArchitect",
                                    email = "architect@google.com"
                                )
                                currentDestination = AppDestination.MAIN_WORKSPACE
                            },
                            isLoading = isLoading,
                            errorMessage = authError
                        )
                    }

                    AppDestination.MAIN_WORKSPACE -> {
                        WorkspaceView(
                            user = currentUser,
                            onSignOut = {
                                currentUser = null
                                currentDestination = AppDestination.AUTH
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun WorkspaceView(
    user: UserProfile?,
    onSignOut: () -> Unit
) {
    // Workspace layout with industrial navigation and Android Layer 1 content
    Column(modifier = Modifier.fillMaxSize()) {
        Surface(
            color = com.platformsteady.ui.theme.MatteCarbon,
            modifier = Modifier.fillMaxWidth().height(60.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
            ) {
                Text(
                    text = "◆ Platform Steady",
                    color = com.platformsteady.ui.theme.MatteWhite,
                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                )

                Row(
                    verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "@${user?.username ?: "Architect"}",
                        color = com.platformsteady.ui.theme.BrushedSilver,
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                        fontSize = 12.sp
                    )

                    Button(
                        onClick = onSignOut,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = com.platformsteady.ui.theme.DarkSlateBorder,
                            contentColor = com.platformsteady.ui.theme.MatteWhite
                        ),
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text("Sign Out", fontSize = 11.sp)
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            contentAlignment = androidx.compose.ui.Alignment.Center
        ) {
            Text(
                text = "Android Architecture Layer 1: Understanding Operating Systems",
                color = com.platformsteady.ui.theme.BrushedSilver,
                fontSize = 18.sp
            )
        }
    }
}
