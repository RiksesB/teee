import api from './api';

/**
 * Servicio de gestión de cursos
 * Interactúa con el backend para CRUD de cursos
 */

/**
 * Obtener todos los cursos con filtros opcionales
 * @param {Object} filters - Filtros opcionales (level, language, isActive, search)
 * @returns {Promise} - Lista de cursos
 */
export const getCourses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.level) params.append('level', filters.level);
    if (filters.language) params.append('language', filters.language);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    throw error;
  }
};

/**
 * Obtener un curso por ID
 * @param {string} courseId - ID del curso
 * @returns {Promise} - Datos del curso
 */
export const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo curso:', error);
    throw error;
  }
};

/**
 * Crear nuevo curso (solo super_admin)
 * @param {Object} courseData - Datos del curso
 * @returns {Promise} - Curso creado
 */
export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creando curso:', error);
    throw error;
  }
};

/**
 * Actualizar curso existente (solo super_admin)
 * @param {string} courseId - ID del curso
 * @param {Object} courseData - Datos actualizados
 * @returns {Promise} - Curso actualizado
 */
export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando curso:', error);
    throw error;
  }
};

/**
 * Eliminar curso (soft delete - solo super_admin)
 * @param {string} courseId - ID del curso
 * @returns {Promise} - Respuesta de eliminación
 */
export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando curso:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de cursos (super_admin y admin)
 * @returns {Promise} - Estadísticas de cursos
 */
export const getCoursesStats = async () => {
  try {
    const response = await api.get('/courses/stats');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas de cursos:', error);
    throw error;
  }
};

/**
 * Enviar curso a usuarios vía WhatsApp
 * @param {string} courseId - ID del curso a enviar
 * @param {Array<string>} phoneNumbers - Lista de números de teléfono
 * @param {boolean} useTemplate - Si usar plantilla de WhatsApp
 * @returns {Promise} - Resultado del envío
 */
export const sendCourseViaWhatsApp = async (courseId, phoneNumbers, useTemplate = false) => {
  try {
    const response = await api.post('/iniciar-prueba', {
      numeros: phoneNumbers,
      usarPlantilla: useTemplate,
      courseId, // Incluimos el ID del curso para futura integración
    });
    return response.data;
  } catch (error) {
    console.error('Error enviando curso vía WhatsApp:', error);
    throw error;
  }
};

export default {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesStats,
  sendCourseViaWhatsApp,
};
