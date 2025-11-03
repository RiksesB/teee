# 🚀 DEPLOY A HEROKU - INSTRUCCIONES RÁPIDAS

## ✅ TODO ESTÁ LISTO

He configurado tu proyecto para hacer deploy a la app existente:
**`secure-fortress-06743`**

## 📋 Ejecuta Este Comando

Abre una terminal y ejecuta:

```bash
cd /home/trilord243/Downloads/Niblion/backend-nestjs
./DEPLOY-AHORA.sh
```

## 🎯 ¿Qué Hará el Script?

1. ✅ Te pedirá login en Heroku (se abrirá el navegador)
2. ✅ Verificará que tienes acceso a la app
3. ✅ Configurará todas las variables de entorno
4. ✅ Hará el deploy del código NestJS
5. ✅ Verificará que todo funcione

## ⚡ Comando Alternativo (Manual)

Si prefieres hacerlo manualmente:

```bash
# 1. Login
heroku login

# 2. Verificar app
heroku apps:info -a secure-fortress-06743

# 3. Configurar variables
heroku config:set \
  WEBHOOK_VERIFY_TOKEN=felipe \
  API_TOKEN=EAAqgFwSHC1ABPNXoDES3lmVcqebOJWZAH2kYc3g6LUQSJ9PnR3GRtxGY5Fa3ZBmv3ZA4FrYKdZCmWVJRDBnyqbUglZCjUvZBOwGOxZAcSZAmzVnBdcoKbfVCSGb8KEJw7A6yPWkZARVZBs7cdWjMh7o7u7J0ZBXmTob9FOj1qDvybrj94QXqwdVfb1xIiFQ6yr1CZC5QPJB7NjO4ZCk16K4FWhg9TzLKZAOPO3zMghNhy12v0VBQZDZD \
  BUSINESS_PHONE=746139171916427 \
  API_VERSION=v22.0 \
  DATABASE_URI="mongodb+srv://trilord:yCpnQFaWAxARxqcl@cluster0.ozzpoo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" \
  NODE_ENV=production \
  -a secure-fortress-06743

# 4. Deploy
git push heroku master --force

# 5. Ver logs
heroku logs --tail -a secure-fortress-06743
```

## 🌐 Tu App Estará En:

```
https://secure-fortress-06743.herokuapp.com
```

## ✅ Después del Deploy

### Probar Webhook:
```bash
curl "https://secure-fortress-06743.herokuapp.com/webhook?hub.mode=subscribe&hub.verify_token=felipe&hub.challenge=test123"
```

Debería responder: `test123`

### Probar Health Check:
```bash
curl https://secure-fortress-06743.herokuapp.com/health
```

### Ver Logs:
```bash
heroku logs --tail -a secure-fortress-06743
```

## 📱 Configurar en Meta Developer

Una vez desplegado:

1. Ve a: https://developers.facebook.com/apps/
2. Tu app de WhatsApp
3. WhatsApp > Configuration > Webhook
4. **Callback URL**: `https://secure-fortress-06743.herokuapp.com/webhook`
5. **Verify Token**: `felipe`
6. Guardar y suscribirse a eventos: `messages`

## 🔧 Comandos Útiles

```bash
# Ver estado
heroku ps -a secure-fortress-06743

# Reiniciar
heroku restart -a secure-fortress-06743

# Ver variables
heroku config -a secure-fortress-06743

# Abrir en navegador
heroku open -a secure-fortress-06743

# Ver logs en tiempo real
heroku logs --tail -a secure-fortress-06743
```

## ⚠️ Importante

- El script usa `--force` para reemplazar completamente el código anterior
- Esto es seguro porque MongoDB tiene tus datos
- Las variables de entorno se configuran automáticamente
- La misma URL funcionará: `secure-fortress-06743.herokuapp.com`

## 🎉 ¡Listo!

Ejecuta el script y en 3-5 minutos tendrás tu backend NestJS en producción.

```bash
./DEPLOY-AHORA.sh
```
