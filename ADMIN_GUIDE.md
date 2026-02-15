# 🛠️ GUÍA DE ADMINISTRACIÓN - MAJOTUBEUNAIDEA

Esta guía detalla el flujo de trabajo profesional para mantener la web y actualizar el software **PRO-2000 MAXIMA**.

---

## 📦 1. GESTIÓN DE ACTUALIZACIONES (300MB+)

Para archivos pesados, nunca los subas directamente a la carpeta de la web. Usa **GitHub Releases**.

### Paso a paso para subir una nueva versión:
1.  **Crea el instalador (.exe)** en tu ordenador.
2.  Ve a tu repositorio en GitHub y haz clic en **"Releases"** -> **"Create a new release"**.
3.  Usa una etiqueta como `v7.0.9`.
4.  Sube el archivo `.exe` (los 300MB) en la zona de "Assets".
5.  Publica el Release.
6.  **Copia el enlace de descarga:** Haz clic derecho sobre el archivo subido en GitHub y selecciona "Copiar dirección de enlace".

---

## 🧠 2. EL "CEREBRO" DE ACTUALIZACIONES (`versions.json`)

El programa PRO-2000 consulta este archivo cada vez que arranca. Si cambias el número de versión aquí, todos los usuarios recibirán el aviso de actualización.

### Cómo actualizar el "Cerebro":
1.  Abre el archivo `versions.json` en tu carpeta local.
2.  Actualiza los campos:
    *   `"version"`: El nuevo número (ej: "7.0.9").
    *   `"url"`: Pega el enlace que copiaste del paso anterior (GitHub Releases).
    *   `"changelog"`: Escribe las mejoras de esta versión.
3.  Guarda y sube el archivo a GitHub (GitHub Pages).

---

## 🌐 3. MANTENIMIENTO DE LA WEB

### Estructura de archivos:
*   `index.html`: Página de inicio y panel de acceso.
*   `pro2000.html`: Detalles del software y botón de solicitud de demo.
*   `css/pages/`: Estilos específicos. Si quieres cambiar un color o margen, busca aquí.
*   `IMAGENES/`: Capturas de pantalla reales del programa.

### Cómo subir cambios visuales:
1.  Modifica el archivo HTML o CSS en tu ordenador.
2.  Súbelo a GitHub mediante "Upload files" o Git.
3.  **Nota:** GitHub Pages tarda unos 30-60 segundos en refrescar los cambios. Si no los ves, pulsa `Ctrl + F5` en el navegador para limpiar la caché.

---

## 🔒 4. REGLA DE ORO
**Nunca pongas enlaces directos a los instaladores de 300MB en el código HTML de la web.** 
Esto evita que bots o usuarios no autorizados descarguen el software. La web solo debe tener botones que apunten a `mailto:` o formularios para que tú decidas a quién das el acceso.

---

*Guía creada por Antigravity para Majotubeunaidea - Febrero 2026*
