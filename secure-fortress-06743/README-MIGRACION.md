# 📚 Migración de Preguntas del Quiz

Este proyecto incluye un sistema completo para gestionar las preguntas del quiz de seguridad digital, con almacenamiento en MongoDB y cache inteligente.

## 📁 Archivos Creados

- **`preguntas-quiz.json`** - Archivo fuente con todas las preguntas estructuradas
- **`migrate-questions.js`** - Script de migración para MongoDB
- **`README-MIGRACION.md`** - Esta documentación

## 🚀 Cómo usar el sistema

### 1. Verificar el estado actual

```bash
node migrate-questions.js --check
```
Este comando verifica si hay preguntas en la base de datos y muestra un resumen.

### 2. Subir preguntas por primera vez

```bash
node migrate-questions.js --upload
```
Sube las preguntas desde `preguntas-quiz.json` a MongoDB.

### 3. Actualizar preguntas existentes

```bash
node migrate-questions.js --reset
```
Borra las preguntas actuales y las recrea desde el archivo JSON.

### 4. Crear backup de las preguntas

```bash
node migrate-questions.js --download
```
Descarga las preguntas actuales de MongoDB a `preguntas-backup.json`.

## 🔧 Modificar Preguntas

### Opción 1: Editar el archivo JSON
1. Edita `preguntas-quiz.json`
2. Ejecuta `node migrate-questions.js --reset`
3. Las preguntas se actualizarán automáticamente

### Opción 2: Usar la API (en producción)
```bash
# Ver todas las preguntas
curl https://tu-app.herokuapp.com/admin/preguntas

# Actualizar un módulo específico
curl -X PUT https://tu-app.herokuapp.com/admin/preguntas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "✅ Módulo 1 – Nuevo Título",
    "preguntas": [...]
  }'

# Recargar cache después de cambios
curl -X POST https://tu-app.herokuapp.com/admin/recargar-preguntas
```

## 📊 Estructura del archivo JSON

```json
{
  "version": "1.0.0",
  "fecha_creacion": "2025-01-15",
  "descripcion": "Preguntas del curso de seguridad digital",
  "modulos": {
    "1": {
      "titulo": "✅ Módulo 1 – Título del módulo",
      "preguntas": [
        {
          "numero": 1,
          "pregunta": "¿Texto de la pregunta?",
          "opciones": [
            "a) Opción A",
            "b) Opción B", 
            "c) Opción C"
          ],
          "respuesta_correcta": "C",
          "retroalimentacion": {
            "A": "❌ Explicación por qué es incorrecta",
            "B": "❌ Explicación por qué es incorrecta", 
            "C": "✅ ¡Correcto! Explicación de por qué es correcta"
          }
        }
      ]
    }
  }
}
```

## 🔄 Sistema de Cache

El sistema implementa cache inteligente que:
- **TTL de 5 minutos** - Evita consultas frecuentes a la BD
- **Versionado por fecha** - Detecta cambios automáticamente
- **Fallback robusto** - Usa preguntas hardcodeadas si falla la BD

### Estados del cache:
1. **Cache válido** - Usa datos en memoria (rápido)
2. **Cache expirado** - Verifica versión en BD
3. **Sin cambios** - Renueva TTL sin recargar
4. **Hay cambios** - Recarga desde BD y actualiza cache

## 🛠️ Variables de Entorno

Asegúrate de tener configurado:
```env
DATABASE_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
```

## 📋 Comandos de Desarrollo

```bash
# Verificar estado
npm run check-questions    # (si agregamos script en package.json)

# Desarrollo local (con simulación)
node migrate-questions.js --check

# Producción
heroku run node migrate-questions.js --check --app tu-app
```

## 🔍 Solución de Problemas

### Error: "DATABASE_URI no está configurada"
- Verifica que el archivo `.env` tenga `DATABASE_URI=...`
- En Heroku, configura la variable: `heroku config:set DATABASE_URI=...`

### Error: "No hay preguntas en la base de datos"
- Ejecuta: `node migrate-questions.js --upload`

### Las preguntas no se actualizan en WhatsApp
- Ejecuta: `curl -X POST https://tu-app.herokuapp.com/admin/recargar-preguntas`
- El cache se actualiza automáticamente cada 5 minutos

### Backup antes de cambios importantes
```bash
node migrate-questions.js --download
# Esto crea preguntas-backup.json con el estado actual
```

## 🎯 Flujo de Trabajo Recomendado

1. **Hacer backup**: `node migrate-questions.js --download`
2. **Editar preguntas**: Modificar `preguntas-quiz.json`
3. **Aplicar cambios**: `node migrate-questions.js --reset`
4. **Verificar**: `node migrate-questions.js --check`
5. **Probar en WhatsApp**: Usar plantilla para iniciar curso

## 📈 Monitoreo

Los logs de la aplicación mostrarán:
- `📋 Usando preguntas desde cache` - Cache funcionando
- `📚 Cargando preguntas desde MongoDB...` - Recarga desde DB
- `✅ Cache actualizado con X módulos` - Cache renovado exitosamente