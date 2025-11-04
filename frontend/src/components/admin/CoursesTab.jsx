import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modules: [],
  });

  const [currentModule, setCurrentModule] = useState({
    title: '',
    videoUrl: '',
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', ''],
    correctAnswer: 'A',
    feedback: { A: '', B: '', C: '' },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (currentQuestion.options.length < 4) {
      const optionLetter = String.fromCharCode(65 + currentQuestion.options.length); // A, B, C, D
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ''],
        feedback: { ...currentQuestion.feedback, [optionLetter]: '' },
      });
    }
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const optionLetter = String.fromCharCode(65 + index);
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      const newFeedback = { ...currentQuestion.feedback };
      delete newFeedback[optionLetter];
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        feedback: newFeedback,
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const updateFeedback = (letter, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      feedback: { ...currentQuestion.feedback, [letter]: value },
    });
  };

  const addQuestionToModule = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt.trim())) {
      setCurrentModule({
        ...currentModule,
        questions: [...currentModule.questions, { ...currentQuestion }],
      });
      // Reset question
      setCurrentQuestion({
        question: '',
        options: ['', '', ''],
        correctAnswer: 'A',
        feedback: { A: '', B: '', C: '' },
      });
    } else {
      alert('Por favor completa todos los campos de la pregunta');
    }
  };

  const removeQuestionFromModule = (index) => {
    const newQuestions = currentModule.questions.filter((_, i) => i !== index);
    setCurrentModule({ ...currentModule, questions: newQuestions });
  };

  const addModuleToCourse = () => {
    if (currentModule.title && currentModule.videoUrl && currentModule.questions.length > 0) {
      setFormData({
        ...formData,
        modules: [...formData.modules, { ...currentModule }],
      });
      // Reset module
      setCurrentModule({
        title: '',
        videoUrl: '',
        questions: [],
      });
    } else {
      alert('Por favor completa el título, video URL y al menos una pregunta para el módulo');
    }
  };

  const removeModuleFromCourse = (index) => {
    const newModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: newModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.modules.length === 0) {
      alert('Debes agregar al menos un módulo al curso');
      return;
    }

    try {
      await api.post('/courses', {
        ...formData,
        status: 'active',
      });

      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        modules: [],
      });
      setCurrentModule({
        title: '',
        videoUrl: '',
        questions: [],
      });
      fetchCourses(); // Reload
    } catch (error) {
      console.error('Error creating course:', error);
      alert(error.response?.data?.message || 'Error al crear curso');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
        <h3 className="text-lg font-semibold text-gray-900">
          Catálogo de Cursos ({courses.length})
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Curso
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay cursos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                  📚
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-3">Módulos: {course.modules?.length || 0}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-600 font-medium bg-secondary-100 px-2 py-1 rounded-full">
                  {course.status || 'active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear curso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Curso</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica del curso */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-gray-900">Información del Curso</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título del Curso *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  />
                </div>
              </div>

              {/* Módulos agregados */}
              {formData.modules.length > 0 && (
                <div className="space-y-3 border-b pb-4">
                  <h3 className="font-semibold text-gray-900">Módulos Agregados ({formData.modules.length})</h3>
                  {formData.modules.map((module, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{module.title}</p>
                          <p className="text-sm text-gray-500">Preguntas: {module.questions.length}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeModuleFromCourse(idx)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Crear nuevo módulo */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-gray-900">Agregar Módulo</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título del Módulo</label>
                  <input
                    type="text"
                    value={currentModule.title}
                    onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video</label>
                  <input
                    type="url"
                    value={currentModule.videoUrl}
                    onChange={(e) => setCurrentModule({ ...currentModule, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>

                {/* Preguntas del módulo actual */}
                {currentModule.questions.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Preguntas en este módulo ({currentModule.questions.length})</label>
                    {currentModule.questions.map((q, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                        <p className="text-sm text-gray-900 truncate flex-1">{q.question}</p>
                        <button
                          type="button"
                          onClick={() => removeQuestionFromModule(idx)}
                          className="text-red-600 hover:text-red-800 text-xs ml-2"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar pregunta al módulo */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-gray-900">Nueva Pregunta</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                    <input
                      type="text"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Opciones */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Opciones</label>
                      {currentQuestion.options.length < 4 && (
                        <button
                          type="button"
                          onClick={addOption}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          + Agregar opción
                        </button>
                      )}
                    </div>
                    {currentQuestion.options.map((option, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      return (
                        <div key={idx} className="mb-2">
                          <div className="flex gap-2 mb-1">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(idx, e.target.value)}
                              placeholder={`Opción ${letter}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />
                            {currentQuestion.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(idx)}
                                className="text-red-600 hover:text-red-800 text-xs px-2"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={currentQuestion.feedback[letter] || ''}
                            onChange={(e) => updateFeedback(letter, e.target.value)}
                            placeholder={`Retroalimentación para ${letter}`}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Respuesta correcta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta Correcta</label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {currentQuestion.options.map((_, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        return <option key={letter} value={letter}>{letter}</option>;
                      })}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addQuestionToModule}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Agregar Pregunta al Módulo
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addModuleToCourse}
                  className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
                >
                  Agregar Módulo al Curso
                </button>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ title: '', description: '', modules: [] });
                    setCurrentModule({ title: '', videoUrl: '', questions: [] });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Crear Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
