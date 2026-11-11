# Spotlight Next 2.0 · Universal Command Center & Hybrid Intelligence

Spotlight Next es un centro de comandos universal e intuitivo desarrollado en **React 19 + TypeScript + Vite + Tailwind CSS**, inspirado en la estética y ergonomía de Raycast y macOS Spotlight. Conserva íntegramente las capacidades nativas, la lógica de negocio y las funciones del proyecto original Android.

## Características Principales

- **Búsqueda Universal & Ranking Inteligente**: Algoritmo de relevancia ponderada con normalización unicode, emparejamiento exacto, por prefijo, subcadena y distancia fuzzy Levenshtein.
- **Planes Inteligentes Multi-Paso**: Reconocimiento en lenguaje natural (español e inglés) de combinaciones complejas como:
  `bajar el brillo al 35% y abrir Spotify` o `subir volumen al 80% y abrir YouTube`. Permite revisar, activar/desactivar pasos, reordenar y ejecutar en vivo con ajuste reversible de brillo (límite seguro 20–100%) y volumen.
- **Calculadora Científica Integrada**: Parser descendente recursivo acotado sin uso de eval. Soporta operaciones aritméticas, potencias, porcentajes (`25% de 800`), trigonometría, raíces cuadradas y constantes matemáticas (`pi`, `e`).
- **Herramientas de Texto & Paleta de Símbolos**: Transformaciones instantáneas (mayúsculas, minúsculas, capitalización, ordenar líneas, quitar duplicados, contador de palabras y caracteres, slug, formato JSON, generación de UUID v4) y catálogo de símbolos y emojis.
- **Herramientas en Línea (Online Tools)**:
  - Pronóstico meteorológico en vivo con la API oficial de **Open-Meteo** (temperatura actual, sensación térmica, humedad, viento y pronóstico de 5 días con probabilidad de precipitación).
  - Conversión de divisas con la API oficial de **Frankfurter** y tasas de respaldo fuera de línea.
  - Consultas enciclopédicas a la API de **Wikipedia**.
  - Definiciones en español con **Wikcionario**.
  - Resultados deportivos para equipos y competiciones favoritas.
- **Sesión de Concentración (Pomodoro)**: Temporizador productivo de 25 minutos con reducción automática de volumen al 20%, conteo de sesiones completadas y ciclos de descanso.
- **Redacción Segura de Mensajes**: Reconocimiento de intenciones como `mandarle un WhatsApp a Juan diciendo nos vemos`. Prepara destinatario y borrador sin envío silencioso automático, garantizando verificación del usuario.
- **Notas & Snippets Reutilizables**: Editor de notas locales con persistencia en `localStorage`, plantillas con variables dinámicas (`{fecha}`, `{hora}`, `{nombre}`) y gestión de clips del portapapeles.
- **Personalización Visual Completa**:
  - 3 familias visuales y 6 presets: **Spotlight Hybrid** (acabado grafito/perla estilo Raycast), **Glass 2.0** (cristal difuminado con brillo especular), **macOS Spotlight**, **iOS Island**, **Raycast Dark** y **Graphite Pro**.
  - Controles de opacidad, curvatura de esquinas, desenfoque de fondo, intensidad de brillo, color de acento y densidad.
- **Privacidad Permanente**: Modo privado configurable que suspende inmediatamente el aprendizaje y el almacenamiento de historial, junto con borrado definitivo de hábitos y exportación anónima de diagnósticos.

## Ejecución y Desarrollo

```bash
npm install
npm run dev
```

El servidor de desarrollo iniciará en `http://0.0.0.0:3000`.
