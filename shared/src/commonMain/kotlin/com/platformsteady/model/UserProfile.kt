package com.platformsteady.model

import kotlinx.serialization.Serializable

@Serializable
data class UserProfile(
    val uid: String = "",
    val username: String = "",
    val email: String = "",
    val displayName: String = "",
    val photoURL: String = "",
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L,
    val completedLessons: List<String> = emptyList()
)
