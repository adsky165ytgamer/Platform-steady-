package com.platformsteady.model

import kotlinx.serialization.Serializable

@Serializable
data class LessonProgress(
    val lessonId: String = "",
    val completed: Boolean = true,
    val completedAt: Long = 0L,
    val synced: Boolean = true
)

@Serializable
data class Concept(
    val term: String,
    val explanation: String
)

@Serializable
data class Lesson(
    val id: String,
    val number: String,
    val title: String,
    val subtitle: String,
    val content: List<String>,
    val keyTakeaway: String,
    val focusConcepts: List<Concept>
)

@Serializable
data class CurriculumLayer(
    val id: String,
    val number: String,
    val title: String,
    val subtitle: String,
    val description: String,
    val learningObjectives: List<String>,
    val lessons: List<Lesson>
)
