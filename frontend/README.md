# 🚀 Niblion - Plataforma de Concienciación en Ciberseguridad

## 📋 Resumen

Niblion es un SaaS B2B que permite a empresas capacitar a sus empleados en ciberseguridad a través de WhatsApp, combinando cursos educativos con simulaciones de phishing usando Gophish.

### ✨ Características Principales

- 🔐 **Sistema de roles**: Admin y Cliente con permisos diferenciados
- 💰 **Pago por persona**: $5.99 USD o Bs. 220 VES por empleado
- 💳 **Múltiples métodos de pago**: PayPal, Pago Móvil, Transferencia Bancaria
- 🌍 **Multi-idioma**: Español e Inglés
- 📱 **Cursos por WhatsApp**: Sin necesidad de apps adicionales
- 🎣 **Simulaciones Gophish**: Phishing real para medir mejora
- 📊 **Dashboard en tiempo real**: Métricas y seguimiento detallado

---

## 🚀 Instalación y Setup

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones.

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📚 Documentación

- [Arquitectura Completa](../docs/ARQUITECTURA_COMPLETA.md)
- [Sistema de Pagos](../docs/PAYMENT_SYSTEM.md)
- [Modelos de Datos](../docs/DATABASE_ARCHITECTURE.md)

---

**Desarrollado con ❤️ por el equipo Niblion**

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
