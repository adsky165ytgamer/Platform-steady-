package com.platformsteady.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.platformsteady.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onComplete: () -> Unit) {
    var animationStage by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        delay(300)
        animationStage = 1 // Title reveal
        delay(800)
        animationStage = 2 // Slogan reveal
        delay(1000)
        animationStage = 3 // Ready
    }

    val diamondRotation by animateFloatAsState(
        targetValue = if (animationStage >= 1) 45f else 0f,
        animationSpec = tween(durationMillis = 1000, easing = FastOutSlowInEasing)
    )

    val titleAlpha by animateFloatAsState(
        targetValue = if (animationStage >= 1) 1f else 0f,
        animationSpec = tween(durationMillis = 800)
    )

    val sloganAlpha by animateFloatAsState(
        targetValue = if (animationStage >= 2) 1f else 0f,
        animationSpec = tween(durationMillis = 800)
    )

    val buttonAlpha by animateFloatAsState(
        targetValue = if (animationStage >= 3) 1f else 0f,
        animationSpec = tween(durationMillis = 600)
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepVoidBlack)
            .padding(24.dp)
    ) {
        // Top Technical Metadata Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.TopCenter)
                .border(bottom = true, color = DarkSlateBorder)
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "PLATFORM_STEADY // CORE_SYS_v1.0",
                color = DimText,
                fontFamily = FontFamily.Monospace,
                fontSize = 11.sp
            )
            Text(
                text = "SKIP [ESC]",
                color = BrushedSilver,
                fontFamily = FontFamily.Monospace,
                fontSize = 11.sp,
                modifier = Modifier.clickable { onComplete() }
            )
        }

        // Center Animated Reveal
        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Geometric Diamond Emblem
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .rotate(diamondRotation)
                    .border(1.dp, DarkSlateBorder, RoundedCornerShape(2.dp)),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .background(MatteWhite, RoundedCornerShape(2.dp))
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Animated Title
            Text(
                text = "Platform Steady",
                color = MatteWhite,
                fontSize = 40.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.alpha(titleAlpha)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Animated Slogan
            Text(
                text = "Master Systems Architecture from First Principles",
                color = BrushedSilver,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .alpha(sloganAlpha)
                    .padding(horizontal = 16.dp)
            )

            Spacer(modifier = Modifier.height(36.dp))

            // Enter Platform Action Button
            Button(
                onClick = onComplete,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MatteWhite,
                    contentColor = DeepVoidBlack
                ),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .alpha(buttonAlpha)
                    .height(46.dp)
            ) {
                Text(
                    text = "INITIALIZE WORKSPACE →",
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp
                )
            }
        }

        // Bottom Architecture Footer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(top = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "TARGET: ANDROID // WASM_JS",
                color = DimText,
                fontFamily = FontFamily.Monospace,
                fontSize = 10.sp
            )
            Text(
                text = "STATUS: ONLINE",
                color = AccentGreen,
                fontFamily = FontFamily.Monospace,
                fontSize = 10.sp
            )
        }
    }
}
