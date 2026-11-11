#!/bin/bash
# ============================================================================
# SPOTLIGHT NEXT v3.0 — GENERADOR AUTOMÁTICO DE APK SUPERPUESTO (NO FULLSCREEN)
# ============================================================================
echo "Configurando Spotlight Next como Ventana Flotante Transparente (Theme.Translucent.NoTitleBar)..."
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
echo "Compilando APK ARM64 para Moto G86 y Galaxy Tab A9+..."
cd android && ./gradlew assembleDebug
echo "✅ APK listo en: android/app/build/outputs/apk/debug/Spotlight-Next-Overlay.apk"
