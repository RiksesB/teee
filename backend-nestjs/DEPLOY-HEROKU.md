# 🚀 Deploy a Heroku - Niblion Backend NestJS

## 📋 Prerrequisitos

1. Cuenta de Heroku (gratis): https://signup.heroku.com/
2. Heroku CLI instalado: https://devcenter.heroku.com/articles/heroku-cli
3. Git instalado

## 🔧 Paso 1: Preparar el Proyecto

El proyecto ya está configurado para Heroku con:
- ✅ `Procfile` - Define cómo ejecutar la app
- ✅ `heroku-postbuild` script - Compila automáticamente
- ✅ `.gitignore` - Excluye archivos innecesarios
- ✅ Engines especificados en `package.json`

## 📦 Paso 2: Inicializar Git (si no está inicializado)

```bash
cd backend-nestjs

# Inicializar git si no existe
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Deploy inicial a Heroku"
```

## 🌐 Paso 3: Crear Aplicación en Heroku

```bash
# Login a Heroku
heroku login

# Crear nueva app (reemplaza 'tu-app-niblion' con un nombre único)
heroku create tu-app-niblion

# O si quieres un nombre aleatorio:
heroku create
```

## ⚙️ Paso 4: Configurar Variables de Entorno

```bash
# Configurar variables de WhatsApp
heroku config:set WEBHOOK_VERIFY_TOKEN=felipe
heroku config:set API_TOKEN=EAAqgFwSHC1ABPNXoDES3lmVcqebOJWZAH2kYc3g6LUQSJ9PnR3GRtxGY5Fa3ZBmv3ZA4FrYKdZCmWVJRDBnyqbUglZCjUvZBOwGOxZAcSZAmzVnBdcoKbfVCSGb8KEJw7A6yPWkZARVZBs7cdWjMh7o7u7J0ZBXmTob9FOj1qDvybrj94QXqwdVfb1xIiFQ6yr1CZC5QPJB7NjO4ZCk16K4FWhg9TzLKZAOPO3zMghNhy12v0VBQZDZD
heroku config:set BUSINESS_PHONE=746139171916427
heroku config:set API_VERSION=v22.0

# Configurar MongoDB
heroku config:set DATABASE_URI=mongodb+srv://trilord:yCpnQFaWAxARxqcl@cluster0.ozzpoo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Configurar otras variables
heroku config:set MOSTRAR_TIP_PRUEBA=true
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=*

# Verificar variables configuradas
heroku config
```

## 🚀 Paso 5: Deploy a Heroku

```bash
# Push a Heroku
git push heroku main

# O si tu rama principal se llama 'master':
git push heroku master

# O si estás en una rama diferente (ej: Ricardo):
git push heroku Ricardo:main
```

## 📊 Paso 6: Verificar el Deploy

```bash
# Ver logs en tiempo real
heroku logs --tail

# Abrir la aplicación en el navegador
heroku open

# Ver estado de la app
heroku ps

# Probar el webhook
curl https://tu-app-niblion.herokuapp.com/webhook?hub.mode=subscribe&hub.verify_token=felipe&hub.challenge=test

# Probar health check
curl https://tu-app-niblion.herokuapp.com/health
```

## 🔄 Paso 7: Configurar Webhook de WhatsApp

Una vez desplegado, debes configurar el webhook en Meta Developer Portal:

1. Ir a: https://developers.facebook.com/apps/
2. Seleccionar tu app de WhatsApp
3. Ir a WhatsApp > Configuration
4. En "Webhook", hacer clic en "Edit"
5. Agregar:
   - **Callback URL**: `https://tu-app-niblion.herokuapp.com/webhook`
   - **Verify Token**: `felipe`
6. Hacer clic en "Verify and Save"
7. Suscribirse a eventos: `messages`

## 🔧 Comandos Útiles de Heroku

```bash
# Ver logs
heroku logs --tail

# Reiniciar la app
heroku restart

# Escalar dynos (0 = apagar, 1 = encender)
heroku ps:scale web=1

# Ver variables de entorno
heroku config

# Agregar/actualizar variable
heroku config:set VARIABLE_NAME=value

# Eliminar variable
heroku config:unset VARIABLE_NAME

# Ejecutar comandos en Heroku
heroku run bash

# Ver información de la app
heroku info

# Abrir dashboard de Heroku
heroku dashboard
```

## 🐛 Troubleshooting

### Error: Application error
```bash
# Ver logs para identificar el problema
heroku logs --tail
```

### Error: Build failed
```bash
# Verificar que el build funciona localmente
npm run build

# Verificar que package.json tiene heroku-postbuild
grep "heroku-postbuild" package.json
```

### Error: Cannot GET /
```bash
# Verificar que el Procfile existe
cat Procfile

# Verificar que start:prod funciona localmente
npm run build
npm run start:prod
```

### MongoDB no conecta
```bash
# Verificar que DATABASE_URI está configurado
heroku config:get DATABASE_URI

# Verificar que MongoDB Atlas permite conexiones desde Heroku
# En MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)
```

## 📱 Testing Completo

Una vez desplegado, prueba:

1. **Health Check**:
   ```bash
   curl https://tu-app-niblion.herokuapp.com/health
   ```

2. **Webhook Verification**:
   ```bash
   curl "https://tu-app-niblion.herokuapp.com/webhook?hub.mode=subscribe&hub.verify_token=felipe&hub.challenge=test123"
   # Debería retornar: test123
   ```

3. **Enviar Template de Prueba**:
   ```bash
   curl -X POST https://tu-app-niblion.herokuapp.com/enviar-test \
     -H "Content-Type: application/json" \
     -d '{"numero":"584121234567"}'
   ```

4. **Webhook de WhatsApp**:
   - Envía un mensaje de WhatsApp al número configurado
   - Verifica logs: `heroku logs --tail`

## 🎯 Métricas y Monitoreo

```bash
# Ver métricas de la app
heroku logs --tail | grep "🚀"

# Ver estadísticas de sesiones
curl https://tu-app-niblion.herokuapp.com/health

# Ver uso de memoria
heroku ps
```

## 💰 Costos

- **Free Tier**: 550-1000 horas/mes gratis
- **Eco Dyno**: $5/mes (nunca se duerme)
- **Basic Dyno**: $7/mes (más recursos)

## ⚠️ Limitaciones del Free Tier

- La app se duerme después de 30 minutos de inactividad
- Tarda ~10 segundos en despertar
- 550 horas gratis/mes (suficiente para desarrollo)

## 🚀 Actualizar la Aplicación

Cada vez que hagas cambios:

```bash
# 1. Hacer commit de los cambios
git add .
git commit -m "Descripción de cambios"

# 2. Push a Heroku
git push heroku main

# 3. Ver logs
heroku logs --tail
```

## 📚 Recursos

- [Heroku Dashboard](https://dashboard.heroku.com/)
- [Heroku Docs](https://devcenter.heroku.com/)
- [NestJS Production](https://docs.nestjs.com/faq/serverless)
- [WhatsApp Webhook Setup](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks)

---

**¡Tu app está lista para producción!** 🎉

URL de tu app: `https://tu-app-niblion.herokuapp.com`
