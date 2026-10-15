package com.platformsteady.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DeepVoidBlack = Color(0xFF080808)
val MatteCarbon = Color(0xFF121212)
val CardBackground = Color(0xFF141414)
val BrushedSilver = Color(0xFFC0C0C0)
val MatteWhite = Color(0xFFF5F5F5)
val DarkSlateBorder = Color(0xFF2A2A2A)
val DimText = Color(0xFF888888)
val AccentGreen = Color(0xFF34D399)

private val MonochromeColorScheme = darkColorScheme(
    primary = MatteWhite,
    onPrimary = DeepVoidBlack,
    secondary = BrushedSilver,
    onSecondary = DeepVoidBlack,
    background = DeepVoidBlack,
    onBackground = MatteWhite,
    surface = MatteCarbon,
    onSurface = MatteWhite,
    surfaceVariant = CardBackground,
    outline = DarkSlateBorder
)

@Composable
fun PlatformSteadyTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = MonochromeColorScheme,
        content = content
    )
}
