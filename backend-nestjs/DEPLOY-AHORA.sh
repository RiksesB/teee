#!/bin/bash

echo "🚀 Deploy de NestJS Backend a Heroku - secure-fortress-06743"
echo "=============================================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Paso 1: Login a Heroku${NC}"
echo "Por favor, sigue las instrucciones en el navegador..."
heroku login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: No se pudo hacer login a Heroku${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Login exitoso${NC}"
echo ""

echo -e "${BLUE}📋 Paso 2: Verificar app de Heroku${NC}"
heroku apps:info -a secure-fortress-06743

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: No tienes acceso a la app 'secure-fortress-06743'${NC}"
    echo "Verifica que esta app existe y tienes permisos."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ App verificada${NC}"
echo ""

echo -e "${BLUE}📋 Paso 3: Configurar variables de entorno${NC}"
heroku config:set \
  WEBHOOK_VERIFY_TOKEN=felipe \
  API_TOKEN=EAAqgFwSHC1ABPNXoDES3lmVcqebOJWZAH2kYc3g6LUQSJ9PnR3GRtxGY5Fa3ZBmv3ZA4FrYKdZCmWVJRDBnyqbUglZCjUvZBOwGOxZAcSZAmzVnBdcoKbfVCSGb8KEJw7A6yPWkZARVZBs7cdWjMh7o7u7J0ZBXmTob9FOj1qDvybrj94QXqwdVfb1xIiFQ6yr1CZC5QPJB7NjO4ZCk16K4FWhg9TzLKZAOPO3zMghNhy12v0VBQZDZD \
  BUSINESS_PHONE=746139171916427 \
  API_VERSION=v22.0 \
  DATABASE_URI=mongodb+srv://trilord:yCpnQFaWAxARxqcl@cluster0.ozzpoo5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 \
  MOSTRAR_TIP_PRUEBA=true \
  NODE_ENV=production \
  CORS_ORIGIN=* \
  -a secure-fortress-06743

echo ""
echo -e "${GREEN}✅ Variables configuradas${NC}"
echo ""

echo -e "${BLUE}📋 Paso 4: Hacer deploy${NC}"
echo -e "${YELLOW}⏳ Esto puede tomar 2-3 minutos...${NC}"
echo ""

git push heroku master --force

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en el deploy${NC}"
    echo "Ver logs: heroku logs --tail -a secure-fortress-06743"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deploy completado exitosamente!${NC}"
echo ""

echo -e "${BLUE}📋 Paso 5: Verificar deploy${NC}"
heroku ps -a secure-fortress-06743

echo ""
echo -e "${GREEN}🎉 ¡Tu backend NestJS está desplegado!${NC}"
echo ""
echo "📱 URL de tu app: https://secure-fortress-06743.herokuapp.com"
echo ""
echo "🔍 Comandos útiles:"
echo "  Ver logs:       heroku logs --tail -a secure-fortress-06743"
echo "  Abrir app:      heroku open -a secure-fortress-06743"
echo "  Ver info:       heroku apps:info -a secure-fortress-06743"
echo "  Reiniciar:      heroku restart -a secure-fortress-06743"
echo ""
echo "✅ Prueba el webhook:"
echo "  curl https://secure-fortress-06743.herokuapp.com/webhook?hub.mode=subscribe&hub.verify_token=felipe&hub.challenge=test"
echo ""
echo "✅ Prueba el health check:"
echo "  curl https://secure-fortress-06743.herokuapp.com/health"
echo ""
