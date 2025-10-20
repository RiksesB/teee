# Guía de Tipografía - Niblion

## Fuentes del Proyecto

### 1. Inter (Fuente Principal)
**Uso**: Todo el contenido general de la aplicación
- Textos de cuerpo
- Botones
- Formularios
- Menús
- Tablas
- Descripciones

**Implementación**:
```css
font-family: 'Inter', ui-sans-serif, system-ui
```

**Pesos disponibles**: 300, 400, 500, 600, 700

---

### 2. Bank Gothic / Orbitron (Fuente de Marca)
**Uso**: Exclusivamente para el nombre "NIBLION"
- Logo en navbar
- Logo en sidebar
- Logo en footer
- Logo en página de login
- Cualquier mención del nombre de la marca

**Implementación CSS**:
```css
.niblion-brand {
  font-family: 'Bank Gothic', 'Orbitron', 'Arial Black', sans-serif;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

**Implementación Tailwind**:
```jsx
<span className="niblion-brand">Niblion</span>
// O alternativamente:
<span className="font-brand font-bold tracking-wide uppercase">Niblion</span>
```

**Fallback fonts**:
1. Bank Gothic (si está instalada en el sistema)
2. Orbitron (Google Fonts - similar geométrica)
3. Arial Black (fallback del sistema)

---

## Ubicaciones del Nombre de Marca

### Navbar Landing Page
```jsx
<Link to="/" className="flex items-center gap-3">
  <NiblionLogo size="md" />
  <span className="text-xl font-bold text-gray-900 niblion-brand">
    Niblion
  </span>
</Link>
```

### Footer
```jsx
<div className="flex items-center gap-3">
  <div className="filter brightness-0 invert">
    <NiblionLogo size="md" />
  </div>
  <span className="text-xl font-bold niblion-brand">Niblion</span>
</div>
```

### Login Page
```jsx
<NiblionLogo size="xxl" />
<h2 className="text-2xl font-bold text-gray-900 mb-2 niblion-brand">
  Niblion
</h2>
```

### Dashboard Sidebar
```jsx
<Link to="/admin" className="flex items-center gap-3">
  <NiblionLogo size="md" />
  <span className="text-xl font-bold text-gray-900 niblion-brand">
    Niblion
  </span>
</Link>
```

---

## Características de la Fuente de Marca

### Bank Gothic
- **Estilo**: Sans-serif geométrica, moderna, tecnológica
- **Características**: Letras condensadas, geométricas, futuristas
- **Asociación**: Tecnología, seguridad, confiabilidad
- **Uso histórico**: Marcas tecnológicas, bancos, videojuegos

### Orbitron (Alternativa)
- **Estilo**: Sans-serif geométrica, futurista
- **Peso**: 400-900
- **Disponibilidad**: Google Fonts (gratis)
- **Similitud**: 85% similar a Bank Gothic
- **Ventajas**: 
  - Gratis y de código abierto
  - Bien renderizada en web
  - Excelente legibilidad en pantallas

---

## Reglas de Uso

### ✅ USAR `.niblion-brand` PARA:
- El nombre "NIBLION" junto al logo
- Títulos principales que mencionan la marca
- Headers de documentos oficiales
- Material de marketing

### ❌ NO USAR `.niblion-brand` PARA:
- Textos de cuerpo
- Descripciones de productos
- Contenido educativo
- Formularios
- Tablas de datos
- Nombres de usuarios
- Mensajes de error
- Cualquier texto que no sea el nombre de la marca

---

## Configuración Técnica

### CSS Global (`index.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');

@layer components {
  .niblion-brand {
    font-family: 'Bank Gothic', 'Orbitron', 'Arial Black', sans-serif;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}
```

### Tailwind Config (`tailwind.config.js`)
```javascript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
  brand: ['Bank Gothic', 'Orbitron', 'Arial Black', 'sans-serif'],
}
```

---

## Jerarquía Tipográfica

### Títulos
```jsx
// H1 - Títulos principales
<h1 className="text-4xl font-bold text-gray-900">

// H2 - Secciones
<h2 className="text-3xl font-bold text-gray-900">

// H3 - Subsecciones
<h3 className="text-2xl font-semibold text-gray-900">

// H4 - Subtítulos
<h4 className="text-xl font-semibold text-gray-900">
```

### Textos
```jsx
// Texto grande
<p className="text-lg text-gray-700">

// Texto normal
<p className="text-base text-gray-700">

// Texto pequeño
<p className="text-sm text-gray-600">

// Texto muy pequeño (labels, captions)
<p className="text-xs text-gray-500">
```

### Especiales
```jsx
// Nombre de marca
<span className="niblion-brand">Niblion</span>

// Código
<code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">

// Énfasis
<strong className="font-semibold text-gray-900">
```

---

## Accesibilidad

### Contraste
- ✅ Bank Gothic/Orbitron en `font-weight: 700` tiene excelente legibilidad
- ✅ `letter-spacing: 0.05em` mejora la legibilidad
- ✅ Siempre usar colores con contraste WCAG AA mínimo (4.5:1)

### Tamaños Mínimos
- Desktop: `text-xl` (20px) mínimo para marca
- Mobile: `text-lg` (18px) mínimo para marca
- Nunca usar `.niblion-brand` en tamaños menores a 16px

### Performance
- Orbitron se carga desde Google Fonts CDN (fast)
- Font-display: swap para evitar FOIT (Flash of Invisible Text)
- Preload crítico en index.html

---

## Ejemplos Visuales

```
┌────────────────────────────────────────┐
│  [LOGO]  NIBLION                       │  ← .niblion-brand
│                                        │
│  Plataforma de Concienciación         │  ← font-sans (Inter)
│  contra Phishing                       │
└────────────────────────────────────────┘
```

---

## Mantenimiento

### Si necesitas cambiar la fuente de marca:
1. Actualizar `@import` en `index.css`
2. Actualizar `fontFamily.brand` en `tailwind.config.js`
3. Actualizar `.niblion-brand` con nueva familia
4. Probar en todos los tamaños y contextos
5. Verificar contraste y legibilidad

### Recursos
- Orbitron en Google Fonts: https://fonts.google.com/specimen/Orbitron
- Bank Gothic alternativas: Microgramma, Eurostile Extended

---

**Última actualización**: Octubre 2025  
**Diseñado por**: Equipo Niblion
