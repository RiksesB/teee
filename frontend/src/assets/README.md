# Assets de Niblion

## Logos

Este directorio contiene el logo oficial de Niblion.

### Logo Niblion (`logo sin nombre.png`)
**Uso principal**: 
- Navbar de la landing page (con texto "Niblion" al lado)
- Dashboard sidebar (con texto "Niblion" al lado)
- Login page (grande, con título debajo)
- Footer (con texto "Niblion" al lado)
- Favicon del sitio
- Iconos de aplicación móvil
- Documentos oficiales
- Presentaciones

**Tamaños disponibles en el componente**:
```jsx
<NiblionLogo size="sm" />   // h-8 (32px)
<NiblionLogo size="md" />   // h-10 (40px) - Por defecto
<NiblionLogo size="lg" />   // h-12 (48px)
<NiblionLogo size="xl" />   // h-16 (64px)
<NiblionLogo size="xxl" />  // h-20 (80px)
```

### Logo con Nombre (`logo con nombre.png`)
Este archivo está disponible pero **no se usa actualmente** en la aplicación.
Se prefiere el logo sin nombre combinado con texto para mayor flexibilidad de diseño.

## Componente Logo

El componente `NiblionLogo` ubicado en `src/components/ui/Logo.jsx` maneja automáticamente la visualización del logo.

### Props disponibles:

| Prop | Tipo | Valores | Por defecto | Descripción |
|------|------|---------|-------------|-------------|
| `size` | string | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"xxl"` | `"md"` | Tamaño del logo |
| `className` | string | - | `""` | Clases CSS adicionales |

### Ejemplos de uso:

```jsx
import { NiblionLogo } from '../components/ui/Logo';

// Logo con texto (navbar, sidebar)
<div className="flex items-center gap-3">
  <NiblionLogo size="md" />
  <span className="text-xl font-bold">Niblion</span>
</div>

// Logo grande (login)
<NiblionLogo size="xxl" />

// Logo invertido para fondo oscuro (footer)
<div className="filter brightness-0 invert">
  <NiblionLogo size="md" />
</div>
```

## Ubicaciones donde se usa el logo:

### Landing Page (`/`)
- ✅ Navbar superior (icono + texto "Niblion")
- ✅ Footer (icono + texto "Niblion", invertido para fondo oscuro)

### Login (`/login`)
- ✅ Centrado en la página (icono grande + título "Niblion")
- ✅ Botón de volver a home

### Dashboard Layout (Admin y Cliente)
- ✅ Sidebar superior (icono + texto "Niblion")
- ✅ Clickeable para volver al dashboard principal

### HTML (`index.html`)
- ✅ Favicon (logo sin nombre)
- ✅ Open Graph image (logo sin nombre)
- ✅ Twitter Card image (logo sin nombre)

## Formatos y especificaciones

### Logo sin Nombre
- **Formato**: PNG con transparencia
- **Dimensiones recomendadas**: 512x512px cuadrado
- **Uso**: Principal en toda la aplicación
- **Combinación**: Siempre acompañado del texto "Niblion" en contextos donde se requiera identificación completa

## Paleta de colores del logo

Los colores principales de Niblion son:
- **Primary**: `#1890ff` (Azul)
- **Secondary**: `#22c55e` (Verde)

Estos colores están definidos en `tailwind.config.js` y se usan consistentemente en toda la aplicación.

## Filosofía de Diseño

El logo sin nombre se usa consistentemente en toda la aplicación por las siguientes razones:

1. **Flexibilidad**: Permite ajustar el tamaño y posición del texto independientemente
2. **Escalabilidad**: El icono se ve bien en cualquier tamaño
3. **Modernidad**: Diseño limpio y minimalista
4. **Responsive**: Fácil de adaptar a diferentes tamaños de pantalla
5. **Consistencia**: Un solo logo para toda la aplicación

## Mantenimiento

### Para actualizar el logo:
1. Reemplazar el archivo `logo sin nombre.png` en este directorio
2. Mantener el nombre exacto del archivo
3. Mantener formato PNG con transparencia
4. Limpiar caché del navegador para ver cambios
5. Regenerar favicon si es necesario

### Para cambiar el texto acompañante:
El texto "Niblion" se renderiza usando HTML/CSS, lo que permite:
- Cambiar fuente fácilmente
- Aplicar estilos diferentes por contexto
- Mantener accesibilidad (texto seleccionable)
- Optimización SEO

---

**Última actualización**: Octubre 2025  
**Diseñador**: [Tu nombre/equipo]  
**Contacto**: [Email de diseño]

