# 🚀 Niblion Backend - NestJS 11

Backend moderno construido con **NestJS 11** para la plataforma Niblion de capacitación en ciberseguridad vía WhatsApp.

## 📋 Estado de Migración

**Progreso: 70% completado** - Ver `MIGRACION.md` para detalles

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env

# Iniciar servicios (Redis + MongoDB)
docker run -d -p 6379:6379 redis:latest
docker run -d -p 27017:27017 mongo:6

# Iniciar desarrollo
npm run start:dev
```

## 📚 Documentación

- **MIGRACION.md**: Estado detallado de la migración
- **CLAUDE.md** (raíz): Documentación completa del proyecto
- **.env.example**: Variables de entorno necesarias

## 🎯 Características

- ✅ NestJS 11 con TypeScript
- ✅ BullMQ + Redis (colas de mensajes)
- ✅ MongoDB + Mongoose
- ⏳ WhatsApp Business API (en progreso)
- ⏳ JWT Authentication (planificado)

---

Desarrollado con ❤️ para la concientización en ciberseguridad
