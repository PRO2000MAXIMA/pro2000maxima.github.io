# Majotubeunaidea - Portal de Innovación Técnica

Portal web estático para compartir software, inventos y conocimiento técnico relacionado con la carpintería de aluminio y PVC.

## 🚀 Estructura del Proyecto

```
majotube-web/
├── index.html          # Página principal
├── pro2000.html        # Página dedicada a PRO-2000 MAXIMA
├── inventos.html       # Galería de inventos y adaptaciones
├── ideas.html          # Ideas y mejoras de proceso
├── css/
│   ├── variables.css   # Design tokens (colores, tipografía, espaciado)
│   ├── base.css        # Reset y estilos base
│   ├── components.css  # Componentes reutilizables (buttons, cards, etc.)
│   └── pages/
│       ├── home.css    # Estilos específicos de index.html
│       └── inventos.css # Estilos específicos de inventos.html
├── js/
│   ├── app.js          # Módulo principal
│   └── modules/
│       ├── header.js   # Control de header (scroll, mobile nav)
│       ├── modal.js    # Modal de imágenes
│       ├── animations.js # Scroll animations
│       └── filter.js   # Sistema de filtrado de inventos
├── assets/             # Imágenes y medios
├── IMAGENES/          # Capturas de PRO-2000
└── README.md          # Este archivo
```

## 💻 Tecnologías

- **HTML5** semántico con SEO optimizado
- **CSS3** modular con custom properties (variables)
- **JavaScript ES6** con módulos nativos
- Sin dependencias externas (excepto Google Fonts)

## 🌐 Hosting Gratuito

Este proyecto está preparado para desplegarse en:

### GitHub Pages (Recomendado)
1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Selecciona la rama `main` y carpeta `/ (root)`
5. Tu sitio estará en `https://tunombre.github.io/nombre-repo`

### Netlify
1. Conecta tu repositorio de GitHub
2. Build command: (dejar vacío)
3. Publish directory: `.`
4. Deploy!

### Vercel
1. Importa desde GitHub
2. Framework preset: Other
3. Deploy!

## 📝 Añadir Nuevos Inventos

Para añadir un nuevo invento, copia esta estructura en `inventos.html`:

```html
<article class="invento-card" data-category="CATEGORIA">
    <div class="invento-card__media">
        <img src="RUTA_IMAGEN" alt="DESCRIPCION" class="invento-card__image">
        <span class="badge badge--accent invento-card__category">CATEGORIA</span>
    </div>
    
    <div class="invento-card__body">
        <h3 class="invento-card__title">TITULO DEL INVENTO</h3>
        <p class="invento-card__description">DESCRIPCION DETALLADA</p>
        
        <div class="invento-card__meta">
            <div class="meta-item">
                <span class="meta-item__label">Materiales</span>
                <span class="meta-item__value">MATERIALES</span>
            </div>
            <div class="meta-item">
                <span class="meta-item__label">Coste Est.</span>
                <span class="meta-item__value">~XX€</span>
            </div>
            <div class="meta-item">
                <span class="meta-item__label">Tiempo</span>
                <span class="meta-item__value">X horas/días</span>
            </div>
        </div>
    </div>
    
    <div class="invento-card__footer">
        <!-- Dificultad: añade clase "active" a las estrellas -->
        <div class="invento-card__difficulty">
            <span class="invento-card__difficulty-label">Dificultad:</span>
            <div class="difficulty">
                <svg class="difficulty__star active" viewBox="0 0 20 20"><polygon points="10,0 13,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 7,7"/></svg>
                <!-- Repetir para 5 estrellas -->
            </div>
        </div>
    </div>
</article>
```

**Categorías disponibles:** `adaptacion`, `herramienta`, `organizacion`, `automatizacion`

## 📝 Añadir Nuevas Ideas

Para añadir una nueva idea, copia esta estructura en `ideas.html`:

```html
<article class="idea-card idea-card--TIPO">
    <div class="idea-card__header">
        <span class="badge badge--primary">TIPO</span>
        <span class="idea-card__icon">EMOJI</span>
    </div>
    <h3 class="idea-card__title">TITULO</h3>
    <p class="idea-card__description">DESCRIPCION</p>
    <div class="idea-card__tags">
        <span class="idea-card__tag">TAG1</span>
        <span class="idea-card__tag">TAG2</span>
    </div>
</article>
```

**Tipos disponibles:** `process`, `technique`, `tip`

## 🎨 Personalización de Colores

Edita `css/variables.css` para cambiar la paleta:

```css
:root {
    --color-primary: #00A3FF;    /* Azul principal */
    --color-accent: #FF8A00;     /* Naranja accent */
    --color-success: #00C853;    /* Verde éxito */
    /* ... */
}
```

## 📱 Responsive

El sitio es completamente responsive con breakpoints en:
- **1024px**: Tablets / Pantallas pequeñas
- **768px**: Móviles

## 📄 Licencia

© 2026 Majotubeunaidea - Todos los derechos reservados
