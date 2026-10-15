package com.platformsteady

import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import com.platformsteady.ui.PlatformSteadyApp

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    CanvasBasedWindow(
        title = "Platform Steady — Systems Architecture Education",
        canvasElementId = "ComposeTarget"
    ) {
        PlatformSteadyApp()
    }
}
