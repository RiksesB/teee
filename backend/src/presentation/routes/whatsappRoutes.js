import express from 'express';
import { WhatsAppWebhookController } from '../controllers/WhatsAppWebhookController.js';

/**
 * Routes: WhatsApp Webhook Routes
 */
export function createWhatsAppRoutes(dependencies) {
  const router = express.Router();
  const controller = new WhatsAppWebhookController(dependencies);

  // Verificación de webhook (GET)
  router.get('/webhook', (req, res) => controller.verifyWebhook(req, res));

  // Manejo de mensajes (POST)
  router.post('/webhook', (req, res) => controller.handleWebhook(req, res));

  return router;
}