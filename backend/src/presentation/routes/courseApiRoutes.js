import express from 'express';
import { CourseApiController } from '../controllers/CourseApiController.js';

/**
 * Routes: Course Management API Routes
 */
export function createCourseApiRoutes(dependencies) {
  const router = express.Router();
  const controller = new CourseApiController(dependencies);

  // Iniciar curso para uno o múltiples usuarios
  router.post('/start-course', (req, res) => controller.startCourse(req, res));

  // Enviar plantilla personalizada
  router.post('/send-template', (req, res) => controller.sendTemplate(req, res));

  // Obtener estadísticas de sesiones activas
  router.get('/statistics', (req, res) => controller.getSessionStatistics(req, res));

  // Obtener progreso de un usuario específico
  router.get('/user/:phoneNumber/progress', (req, res) => controller.getUserProgress(req, res));

  // Limpiar sesiones expiradas
  router.post('/cleanup-sessions', (req, res) => controller.cleanupSessions(req, res));

  return router;
}