import React, { useState, useEffect } from 'react';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  sendCourseViaWhatsApp,
} from '../../services/coursesService';
import { BookOpen, Plus, Send, Edit2, Trash2, Clock, Users as UsersIcon } from 'lucide-react';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    level: '',
    language: '',
    isActive: true,
    search: '',
  });

  // Form data para crear/editar curso
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'basic',
    language: 'es',
    durationMinutes: 30,
    thumbnailUrl: '',
    tags: [],
    modules: [],
    isActive: true,
  });

  // Cargar cursos al montar el componente
  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourses(filters);
      setCourses(response.courses || []);
    } catch (err) {
      setError('Error al cargar los cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      level: 'basic',
      language: 'es',
      durationMinutes: 30,
      thumbnailUrl: '',
      tags: [],
      modules: [],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      language: course.language,
      durationMinutes: course.durationMinutes,
      thumbnailUrl: course.thumbnailUrl || '',
      tags: course.tags || [],
      modules: course.modules || [],
      isActive: course.isActive,
    });
    setShowModal(true);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCourse) {
        await updateCourse(editingCourse._id, formData);
      } else {
        await createCourse(formData);
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError('Error al guardar el curso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este curso?')) {
      return;
    }
    try {
      setLoading(true);
      await deleteCourse(courseId);
      fetchCourses();
    } catch (err) {
      setError('Error al eliminar el curso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCourse = (course) => {
    setSelectedCourse(course);
    setShowSendModal(true);
  };

  const getLevelBadge = (level) => {
    const badges = {
      basic: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return badges[level] || badges.basic;
  };

  const getLevelLabel = (level) => {
    const labels = {
      basic: 'Básico',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };
    return labels[level] || 'Básico';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Administra el contenido educativo y módulos interactivos
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Nuevo Curso</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los niveles</option>
              <option value="basic">Básico</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los idiomas</option>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
          <div className="mb-4">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay cursos disponibles</h3>
          <p className="text-gray-600 mb-4">Crea tu primer curso para comenzar</p>
          <button
            onClick={handleCreateCourse}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Crear Primer Curso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Course Image/Placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Course Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{course.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadge(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.durationMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-4 h-4" />
                    {course.enrolledCount || 0} inscritos
                  </span>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendCourse(course)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    Enviar
                  </button>
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
              </h2>
              <form onSubmit={handleSubmitCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Ciberseguridad Básica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe el contenido del curso..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="basic">Básico</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración (minutos)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
                    <input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Curso activo
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : editingCourse ? 'Actualizar' : 'Crear Curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Send Course Modal */}
      {showSendModal && selectedCourse && (
        <SendCourseModal
          course={selectedCourse}
          onClose={() => {
            setShowSendModal(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
};

// Send Course Modal Component
const SendCourseModal = ({ course, onClose }) => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      // Convertir números de teléfono separados por comas o saltos de línea
      const numbers = phoneNumbers
        .split(/[,\n]/)
        .map((num) => num.trim())
        .filter((num) => num);

      const response = await sendCourseViaWhatsApp(course._id, numbers, useTemplate);
      setResult({ success: true, message: 'Curso enviado exitosamente' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setResult({ success: false, message: 'Error al enviar el curso' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Enviar Curso por WhatsApp</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Curso:</strong> {course.title}
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Números de teléfono (separados por comas o líneas)
              </label>
              <textarea
                required
                value={phoneNumbers}
                onChange={(e) => setPhoneNumbers(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="584121234567&#10;584129876543&#10;..."
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 584121234567 (código de país + número)</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useTemplate"
                checked={useTemplate}
                onChange={(e) => setUseTemplate(e.target.checked)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="useTemplate" className="text-sm font-medium text-gray-700">
                Usar plantilla de WhatsApp (para usuarios fuera de la ventana de 24 horas)
              </label>
            </div>

            {result && (
              <div
                className={`p-3 rounded-lg ${
                  result.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {result.message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar Curso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
