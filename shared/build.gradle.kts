plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.jetbrainsCompose)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.kotlinxSerialization)
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "17"
            }
        }
    }

    wasmJs {
        moduleName = "platformsteady"
        browser {
            commonWebpackConfig {
                outputFileName = "platformsteady.js"
            }
        }
        binaries.executable()
    }

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.components.resources)

            // Coroutines & Serialization
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
            implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.6.0")

            // GitLive Firebase Multiplatform (Android + Wasm/JS + iOS)
            implementation("dev.gitlive:firebase-firestore:1.12.0")
            implementation("dev.gitlive:firebase-auth:1.12.0")
        }

        androidMain.dependencies {
            implementation("androidx.activity:activity-compose:1.9.0")
            implementation("androidx.appcompat:appcompat:1.6.1")
            implementation("androidx.core:core-ktx:1.13.1")
        }

        wasmJsMain.dependencies {
            implementation(compose.html.core)
        }
    }
}

android {
    namespace = "com.platformsteady"
    compileSdk = 34

    defaultConfig {
        minSdk = 24
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
