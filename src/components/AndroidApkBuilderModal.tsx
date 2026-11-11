import React, { useState } from 'react';
import {
  Smartphone, Download, Check, Copy, Layers, Shield,
  Terminal, FileCode, ExternalLink, Sparkles, X, Eye
} from 'lucide-react';
import { AppConfig } from '../types';

interface AndroidApkBuilderModalProps {
  isOpen: boolean;
  config: AppConfig;
  isPureOverlayMode: boolean;
  onTogglePureOverlayMode: (val: boolean) => void;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AndroidApkBuilderModal: React.FC<AndroidApkBuilderModalProps> = ({
  isOpen,
  config,
  isPureOverlayMode,
  onTogglePureOverlayMode,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'manifest' | 'github'>('download');
  const [buildingApk, setBuildingApk] = useState(false);
  const [apkReady, setApkReady] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="dev.bautista.spotlight">

    <!-- Permisos de Asistente Universal y Barra Superpuesta (NO Pantalla Completa) -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE" />

    <application
        android:allowBackup="true"
        android:label="Spotlight Next"
        android:supportsRtl="true"
        android:hardwareAccelerated="true">

        <!-- Activity Flotante Transparente (NO Pantalla Completa) -->
        <activity
            android:name=".SpotlightOverlayActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Translucent.NoTitleBar"
            android:launchMode="singleInstance"
            android:excludeFromRecents="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize|stateAlwaysVisible">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <action android:name="android.intent.action.ASSIST" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>

        <!-- Tile en Centro de Control de Android para abrir la barra sobre cualquier app -->
        <service
            android:name=".SpotlightQuickTileService"
            android:label="Spotlight"
            android:permission="android.permission.BIND_QUICK_SETTINGS_TILE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.quicksettings.action.QS_TILE" />
            </intent-filter>
        </service>
    </application>
</manifest>`;

  const kotlinOverlayActivity = `package dev.bautista.spotlight

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.WindowManager
import android.webkit.WebSettings
import android.webkit.WebView

class SpotlightOverlayActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Configurar ventana como SUPERPOSICIÓN FLOTANTE (NO Pantalla Completa)
        window.setBackgroundDrawableResource(android.R.color.transparent)
        window.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
        window.addFlags(
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
            WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH or
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        )

        val params = window.attributes
        params.width = WindowManager.LayoutParams.MATCH_PARENT
        params.height = WindowManager.LayoutParams.WRAP_CONTENT
        params.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        params.y = 48 // Margen superior flotante en Moto G86 / Tab A9+
        window.attributes = params

        val webView = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            loadUrl("file:///android_asset/public/index.html?mode=overlay")
        }
        setContentView(webView)
    }
}`;

  const githubActionYaml = `name: Build Spotlight Next Android Overlay APK
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Build Web Assets & Package Overlay APK
        run: |
          npm install
          npm run build
          npx cap sync android
          cd android && ./gradlew assembleDebug
      - name: Upload Ready-to-Install APK
        uses: actions/upload-artifact@v4
        with:
          name: Spotlight-Next-v3.0-Overlay-ARM64.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk`;

  const handleDownloadNativeApkBundle = () => {
    setBuildingApk(true);
    setTimeout(() => {
      setBuildingApk(false);
      setApkReady(true);

      // Generate a self-contained Android Overlay Project + Config bundle so the user gets all files immediately
      const bundleContent = {
        package: 'dev.bautista.spotlight',
        versionName: '3.0.0-Overlay',
        versionCode: 30,
        windowMode: 'TRANSLUCENT_FLOATING_OVERLAY_NO_FULLSCREEN',
        targetDevices: ['Motorola Moto G86 5G (120Hz pOLED)', 'Samsung Galaxy Tab A9+ (90Hz Split View)'],
        savedUserPreferences: config,
        files: {
          'android/app/src/main/AndroidManifest.xml': androidManifestXml,
          'android/app/src/main/java/dev/bautista/spotlight/SpotlightOverlayActivity.kt': kotlinOverlayActivity,
          '.github/workflows/build-apk.yml': githubActionYaml,
          'capacitor.config.json': {
            appId: 'dev.bautista.spotlight',
            appName: 'Spotlight Next',
            webDir: 'dist',
            android: {
              backgroundColor: '#00000000',
              allowMixedContent: true,
            },
          },
        },
      };

      const blob = new Blob([JSON.stringify(bundleContent, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Spotlight-Next-v3.0-Android-Overlay-Project.json';
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('📦 Paquete Android Overlay (No Pantalla Completa) descargado');
    }, 650);
  };

  const handleDownloadSignedApkBinary = () => {
    // Provides the Android APK package manifest & build script ready for Moto G86 / Tab A9+
    const apkSetupScript = `#!/bin/bash
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
`;
    const blob = new Blob([apkSetupScript], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-spotlight-overlay-apk.sh';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('🚀 Script compilador de APK Overlay descargado');
  };

  const copyBlock = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(key);
    onShowToast('Código copiado al portapapeles');
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#111722]/98 border border-emerald-500/35 rounded-3xl shadow-[0_28px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>APK Nativo Android · Modo Ventana Superpuesta</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                  NO Pantalla Completa
                </span>
              </h3>
              <p className="text-xs text-neutral-300">
                Configurado con <code className="text-emerald-300 font-mono">Theme.Translucent.NoTitleBar</code> + <code className="text-sky-300 font-mono">SYSTEM_ALERT_WINDOW</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Pure Overlay Switch Banner */}
        <div className="px-5 py-3 bg-emerald-950/35 border-b border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-emerald-100">
            <strong>🪟 Probar cómo se ve el APK Superpuesto ahora mismo:</strong> oculta el fondo de ajustes y deja <strong>únicamente la barra flotante y el Split Inspector</strong>.
          </div>
          <button
            onClick={() => {
              onTogglePureOverlayMode(!isPureOverlayMode);
              onShowToast(
                !isPureOverlayMode
                  ? '🪟 Modo APK Superpuesto (No Pantalla Completa) activado'
                  : 'Fondo de Ajustes visible nuevamente'
              );
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer shrink-0 flex items-center gap-1.5 transition-all ${
              isPureOverlayMode
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {isPureOverlayMode
                ? 'Salir de Vista Overlay Pura'
                : 'Activar Vista Overlay Pura (Sin Fondo)'}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-black/40 border-b border-white/10 text-xs shrink-0">
          {[
            { id: 'download', label: '📦 Descargar APK & Proyecto', icon: Download },
            { id: 'manifest', label: '⚙️ AndroidManifest (No Fullscreen)', icon: Layers },
            { id: 'github', label: '⚡ Compilar .APK en GitHub Actions', icon: FileCode },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer flex items-center gap-1.5 transition-all ${
                  activeTab === t.id
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                    : 'text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-neutral-300 scrollbar-thin">
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-white">
                  ¿Cómo funciona el APK de Spotlight Next sin Pantalla Completa?
                </h4>
                <ul className="space-y-1.5 text-neutral-300 list-disc pl-4">
                  <li>
                    <strong>Ventana Flotante Transparente (`Theme.Translucent.NoTitleBar`):</strong> Al tocar el ícono o el botón del Centro de Control de tu Moto G86 / Tab A9+, <strong>no tapa tu pantalla ni abre una app pesada</strong>. Aparece solamente la píldora de búsqueda y el Split Inspector flotando arriba de WhatsApp, Chrome, YouTube o tu fondo de pantalla.
                  </li>
                  <li>
                    <strong>Toque afuera para cerrar (`FLAG_WATCH_OUTSIDE_TOUCH`):</strong> Cuando tocás afuera de la barra o presionás atrás, la barra desaparece al instante devolviéndote a la app que estabas usando.
                  </li>
                  <li>
                    <strong>Asistente Predeterminado (`ACTION_ASSIST`):</strong> Podés asignarlo al gesto de mantener apretado el botón de inicio o al mosaico rápido de Android.
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-black/50 border border-emerald-500/35 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                      Opción 1 • Paquete Android Overlay Completo
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Proyecto Capacitor + Manifest Translucent + Tus Ajustes
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Incluye tu configuración actual (`v3.0`), tu Alias de Mercado Pago (`{config.paymentAlias || 'bauti.spotlight.mp'}`), `AndroidManifest.xml` sin pantalla completa y `SpotlightOverlayActivity.kt`.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadNativeApkBundle}
                    disabled={buildingApk}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {buildingApk
                        ? 'Empaquetando configuración...'
                        : apkReady
                        ? '✓ Descargado (Click para bajar de nuevo)'
                        : 'Descargar Paquete Android Overlay'}
                    </span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/15 to-black/50 border border-sky-500/35 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-mono text-sky-400 font-bold uppercase">
                      Opción 2 • Script Compilador Directo (.APK)
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Autogenerador `Spotlight-Next-Overlay.apk`
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Descarga el script `build-spotlight-overlay-apk.sh` listo para correr en Termux, Android Studio o GitHub Codespaces y obtener el `.apk` instalable en 1 comando.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadSignedApkBinary}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Descargar Script Compilador `.APK`</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  1. `AndroidManifest.xml` (Configurado como Ventana Superpuesta Transparente)
                </span>
                <button
                  onClick={() => copyBlock('manifest', androidManifestXml)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                >
                  {copiedCode === 'manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar XML</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                {androidManifestXml}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-white">
                  2. `SpotlightOverlayActivity.kt` (Altura `WRAP_CONTENT` flotante, sin tapar tus apps)
                </span>
                <button
                  onClick={() => copyBlock('kotlin', kotlinOverlayActivity)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                >
                  {copiedCode === 'kotlin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Kotlin</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-sky-300 overflow-x-auto max-h-48 scrollbar-thin">
                {kotlinOverlayActivity}
              </pre>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>💡 Compilación sin instalar Android Studio en tu PC:</strong> Pegá este archivo en <code className="font-mono">.github/workflows/build-apk.yml</code> en tu repositorio de GitHub y GitHub te compila gratis el archivo <strong>`Spotlight-Next-v3.0-Overlay-ARM64.apk`</strong> listo para bajar al celular en cada cambio.
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">`.github/workflows/build-apk.yml`</span>
                <button
                  onClick={() => copyBlock('gh', githubActionYaml)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer flex items-center gap-1"
                >
                  {copiedCode === 'gh' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Workflow</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black/70 border border-white/10 font-mono text-[11px] text-amber-300 overflow-x-auto max-h-60 scrollbar-thin">
                {githubActionYaml}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-black/50 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-neutral-400">
            Package: <strong className="text-white">dev.bautista.spotlight</strong> • ARM64 Overlay
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
