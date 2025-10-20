# Landing Page de Niblion

## Descripción General

La landing page de Niblion es una página de presentación profesional del producto que sirve como punto de entrada principal para visitantes no autenticados. Está diseñada para convertir visitantes en clientes potenciales mediante información clara, diseño atractivo y llamados a la acción efectivos.

## Estructura de la Página

### 1. Navegación Superior (Nav Bar)
- **Logo de Niblion**: Visible en la esquina superior izquierda
- **Menú de navegación**: Enlaces a secciones (#features, #pricing, #how-it-works, #contact)
- **Selector de idioma**: Cambio entre Español e Inglés
- **Botón "Iniciar Sesión"**: Redirige a `/login`
- **Menú móvil responsivo**: Hamburger menu para dispositivos móviles

**Características técnicas:**
- Fixed position con backdrop blur
- Scroll suave a secciones con `scroll-behavior: smooth`
- Menu móvil animado con estado React

### 2. Hero Section
Sección principal de impacto visual con:

**Contenido:**
- **Título principal**: "Protege a tu Equipo del Phishing"
- **Subtítulo descriptivo**: Explicación del valor del producto
- **2 CTAs primarios**:
  - "Solicitar Demo Gratuita" → scroll a #contact (con animación pulse)
  - "Conocer Más" → scroll a #how-it-works
- **Estadísticas sociales**:
  - 98% mejora en concienciación
  - 50K+ personas capacitadas
  - 200+ empresas confían en nosotros

**Diseño:**
- Gradient background animado (from-primary-50 via-white to-secondary-50)
- Grid 2 columnas (desktop): texto + mockup visual
- Mockup con animación de flotación (`float-animation`)
- Estadísticas con animación de fade-in escalonada

### 3. Features Section
Presenta 6 características principales del producto en grid de 3 columnas:

1. **Cursos por WhatsApp** 📱
   - Capacitación interactiva
   - Módulos cortos y efectivos
   
2. **Simulaciones Reales** 🎣
   - Campañas con Gophish
   - Evaluación de vulnerabilidad
   
3. **Reportes Detallados** 📊
   - Analítica completa
   - Métricas por empleado/departamento
   
4. **Pago por Persona** 💰
   - Modelo flexible
   - $5.99 USD o Bs. 220 VES
   
5. **Multi-idioma** 🌍
   - Español e Inglés
   - Cursos adaptados
   
6. **Seguridad Garantizada** 🔐
   - Datos encriptados
   - Cumplimiento internacional

**Efectos visuales:**
- Cards con hover effect (translateY -8px)
- Clase `feature-card` con transiciones suaves
- Gradientes de colores únicos por card

### 4. How it Works Section
Proceso en 4 pasos con números circulares:

1. **Regístrate y Adquiere Créditos**
   - Crear cuenta
   - Comprar créditos según necesidad

2. **Configura tu Campaña**
   - Seleccionar curso
   - Agregar WhatsApp numbers
   - Programar envío

3. **Tu Equipo Aprende**
   - Módulos interactivos por WhatsApp
   - Evaluaciones en tiempo real

4. **Simula y Mide**
   - Lanzar simulaciones de phishing
   - Reportes detallados

**Diseño:**
- Grid 4 columnas (desktop) / 1 columna (móvil)
- Círculos numerados con colores distintivos
- Background gris claro (bg-gray-50)

### 5. Pricing Section
Información de precios clara y transparente:

**Modelo de negocio:**
- **Precio por persona**: $5.99 USD o Bs. 220 VES
- **Incluye**: 
  - 1 curso completo vía WhatsApp
  - 1 simulación de phishing con Gophish
  - Reportes y analítica detallada

**Métodos de pago:**
- 💳 PayPal (pago automático)
- 📱 Pago Móvil Venezuela (verificación manual)
- 🏦 Transferencia Bancaria (verificación manual)

**Diseño:**
- Card central con gradient background
- Grid 2 columnas: Incluye / Métodos de Pago
- CTA prominente "Comenzar Ahora" → scroll a #contact

### 6. Contact Section
Formulario de contacto para solicitar demos o información:

**Campos del formulario:**
- Nombre Completo
- Correo Electrónico
- Empresa
- Teléfono
- Mensaje (textarea)
- Botón "Enviar Mensaje"

**Información de contacto:**
- 📧 Email: contacto@niblion.com
- 📱 WhatsApp: +58 412 123 4567
- 🌐 Web: www.niblion.com

**Funcionalidad:**
- Validación de formulario (pendiente backend)
- Diseño en card blanco con sombra
- Grid de 3 columnas para información de contacto

### 7. Footer
Footer completo con información organizacional:

**Estructura en 4 columnas:**
1. **Logo y descripción**: Branding y tagline
2. **Producto**: Links a Features, Pricing, How it Works
3. **Empresa**: Links a Contact, Login
4. **Legal**: Política de Privacidad, Términos de Servicio

**Diseño:**
- Background oscuro (bg-gray-900)
- Texto blanco/gris claro
- Copyright © 2025 Niblion

## Internacionalización (i18n)

La landing page está completamente traducida en **Español** e **Inglés**:

### Estructura de traducciones
```javascript
translations.es.landing
translations.en.landing
```

### Categorías de traducciones:
- `landing.hero`: Sección hero
- `landing.features`: Características del producto
- `landing.howItWorks`: Proceso paso a paso
- `landing.pricing`: Información de precios
- `landing.contact`: Formulario de contacto
- `landing.footer`: Footer y legal

**Uso en componentes:**
```jsx
const { t } = useTranslation();
<h1>{t('landing.hero.title')}</h1>
```

## Animaciones y Efectos

### CSS Personalizado (LandingPage.css)

1. **Smooth Scroll**
   ```css
   html { scroll-behavior: smooth; }
   ```

2. **Gradient Shift Animation**
   - Animación de 15s en hero background
   - Keyframe `gradient-shift`

3. **Card Hover Effects**
   - Transform translateY(-8px) en hover
   - Clase `.feature-card`

4. **Fade In Up**
   - Animación 0.6s ease-out
   - Usado en estadísticas del hero

5. **Pulse Glow**
   - Animación 2s infinite en CTA principal
   - Clase `.cta-pulse`

6. **Float Animation**
   - Animación 6s ease-in-out infinite
   - Usado en mockup del hero
   - Clase `.float-animation`

7. **Mobile Menu Slide Down**
   - Animación 0.3s ease-out
   - Clase `.mobile-menu`

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (lg)

### Adaptaciones móviles:
- Nav bar colapsa a hamburger menu
- Hero: grid 1 columna (texto sobre mockup)
- Features: grid 1 columna
- How it Works: grid 1 columna
- Pricing: grid 1 columna
- Contact: formulario full-width
- Footer: grid 1-2 columnas

## Integración con el Sistema

### Rutas
```javascript
// App.jsx
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<Login />} />
```

### Navegación
- **Homepage** (`/`): Landing page pública
- **Login** (`/login`): Autenticación
- **Dashboards**: `/admin/*` y `/client/*` (protegidos)

### AuthContext
- Landing page es **pública** (no requiere autenticación)
- Links a `/login` para usuarios existentes
- Formulario de contacto para nuevos clientes potenciales

## Performance

### Optimizaciones implementadas:
- **Lazy loading**: Imágenes y componentes pesados
- **CSS crítico**: Inline en index.html
- **Backdrop blur**: Efecto de desenfoque en nav bar
- **Transiciones GPU**: Transform y opacity para animaciones

### Métricas objetivo:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

## SEO y Metadatos

### Meta tags recomendados (index.html):
```html
<title>Niblion - Plataforma de Concienciación contra Phishing</title>
<meta name="description" content="Capacita a tu equipo con cursos interactivos por WhatsApp y simulaciones reales de phishing. Reduce riesgos de ciberseguridad." />
<meta name="keywords" content="phishing, ciberseguridad, capacitación, WhatsApp, Gophish, concienciación" />
<meta property="og:title" content="Niblion - Protege a tu Equipo del Phishing" />
<meta property="og:description" content="Plataforma líder en capacitación anti-phishing para empresas" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://niblion.com" />
```

### Structured Data (Schema.org):
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Niblion",
  "applicationCategory": "SecurityApplication",
  "offers": {
    "@type": "Offer",
    "price": "5.99",
    "priceCurrency": "USD"
  }
}
```

## Próximos Pasos

### Funcionalidades pendientes:
1. **Backend del formulario de contacto**
   - POST /api/public/contact
   - Validación de campos
   - Email de confirmación
   - Integración con CRM

2. **Analítica**
   - Google Analytics 4
   - Eventos personalizados (CTA clicks, form submissions)
   - Heatmaps (Hotjar)

3. **A/B Testing**
   - Variantes de CTAs
   - Diferentes headlines
   - Precios y ofertas

4. **Testimonios**
   - Sección de casos de éxito
   - Logos de clientes
   - Reseñas verificadas

5. **Blog/Resources**
   - Artículos sobre phishing
   - Guías de seguridad
   - Casos de estudio

6. **Chat en vivo**
   - Soporte inmediato
   - WhatsApp Business API
   - Chatbot automático

## Mantenimiento

### Actualizaciones regulares:
- Estadísticas (98%, 50K+, 200+)
- Precios ($5.99, Bs. 220)
- Información de contacto
- Casos de éxito

### Monitoreo:
- Broken links
- Form submissions
- Page load speed
- Mobile usability

## Referencias de Diseño

La landing page está inspirada en el template **Protocol** de Tailwind UI, adaptado a las necesidades específicas de Niblion:

### Componentes adaptados:
- Navigation bar (Protocol → Niblion nav)
- Hero section (Protocol hero → Niblion gradient hero)
- Feature grid (Protocol features → 6 features con emojis)
- Footer (Protocol footer → 4 columnas Niblion)

### Paleta de colores personalizada:
- Primary: #1890ff (azul)
- Secondary: #22c55e (verde)
- Danger: #ef4444 (rojo, phishing alerts)
- Warning: #f59e0b (naranja)
- Safe: #10b981 (verde seguro)

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Autor**: Equipo de Desarrollo Niblion
