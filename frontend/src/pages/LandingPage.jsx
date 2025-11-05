import React from 'react';
import { Link } from 'react-router-dom';
import { NiblionLogo } from '../components/ui/Logo';
import emailjs from '@emailjs/browser';
import './LandingPage.css';

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCardFlipped, setIsCardFlipped] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Enviar email usando EmailJS
      await emailjs.send(
        'service_4gdhn2h',      // Service ID
        'template_o4p276m',     // Template ID
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          email: contactForm.email,  // Para Reply To
          company: contactForm.company,
          phone: contactForm.phone,
          message: contactForm.message,
          name: contactForm.name,  // Alias adicional
        },
        '-oC-zAWUmZgMJmIuf'     // Public Key
      );
      
      setSubmitMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.');
      
      // Limpiar formulario
      setContactForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error al enviar email:', error);
      setSubmitMessage('Error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/98 backdrop-blur-sm border-b border-gray-150 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <NiblionLogo size="md" />
              <span className="text-xl font-bold text-gray-900 niblion-brand">Niblion</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                Precios
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
                Cómo Funciona
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Contacto
              </a>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-blue-600 shadow-xl border-t border-blue-500 z-50">
              <div className="flex flex-col py-4">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  Características
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  Precios
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  Cómo Funciona
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  Contacto
                </a>
                <div className="px-6 py-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center shadow-md"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Capacitación en Ciberseguridad para Todos
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Protege a tu equipo, tu negocio o a tus seres queridos con capacitación accesible en seguridad digital. Desde PyMEs hasta instituciones, Niblion hace la educación en ciberseguridad simple y efectiva.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all text-center font-medium text-lg shadow-lg hover:shadow-xl cta-pulse"
                >
                  Contáctanos
                </a>
              </div>
            </div>

            <div className="relative float-animation">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Para Todos</div>
                      <div className="text-xs text-gray-600">PyMEs, instituciones, familias. Cualquiera puede aprender.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Usa WhatsApp</div>
                      <div className="text-xs text-gray-600">No descargas apps raras. Todo por la app que ya conoces.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Precio Justo</div>
                      <div className="text-xs text-gray-600">Pagas solo por quien capacitas. Sin mensualidades.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Capacitación Accesible para Todos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No importa si tienes una empresa grande, una PyME, una institución educativa o simplemente quieres proteger a tus seres queridos. Niblion está diseñado para todos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Cursos por WhatsApp
              </h3>
              <p className="text-gray-600">
                Aprende directo en la app que ya usas todos los días. Sin descargas, sin complicaciones. Solo abre WhatsApp y comienza.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl border border-secondary-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Para Todos los Públicos
              </h3>
              <p className="text-gray-600">
                Desde tu tía que recién empieza a usar el celular, hasta equipos corporativos completos. Contenido adaptado y fácil de entender.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Simulaciones Reales
              </h3>
              <p className="text-gray-600">
                Practica identificando amenazas reales en un entorno seguro. Aprende haciendo, no solo leyendo.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Precio Justo
              </h3>
              <p className="text-gray-600">
                Paga solo por quien capacitas. Sin suscripciones mensuales, sin letra pequeña. Transparencia total.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reportes Claros
              </h3>
              <p className="text-gray-600">
                Si capacitas a un equipo, obtén métricas sencillas de quién completó el curso y cómo les fue.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tu Privacidad Primero
              </h3>
              <p className="text-gray-600">
                Tus datos son tuyos. No compartimos, no vendemos información. Punto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-75">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Tan simple que tu abuela podría usarlo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Elige tu Plan
              </h3>
              <p className="text-gray-600">
                Decide cuántas personas quieres capacitar. Puede ser una sola persona o un equipo completo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Agrega los Números
              </h3>
              <p className="text-gray-600">
                Solo necesitas el número de WhatsApp de las personas que recibirán el curso.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Ellos Aprenden
              </h3>
              <p className="text-gray-600">
                Recibirán mensajes interactivos con lecciones cortas y ejemplos reales de amenazas.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Tú Haces Seguimiento
              </h3>
              <p className="text-gray-600">
                Ve quién completó el curso y cómo les fue (si capacitas a varias personas).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Precio Transparente
            </h2>
            <p className="text-xl text-gray-600">
              Sin trucos, sin suscripciones ocultas
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="w-full h-[500px] sm:h-[480px] md:h-[520px] lg:h-[550px] relative">
              <div 
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                  isCardFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                
                {/* Frente de la tarjeta */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl border-2 border-blue-200 shadow-xl overflow-hidden">
                  <div className="h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-start">
                      <div></div>
                      <div className="animate-bounce">
                        <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-h-0">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-center">
                        Por Persona
                      </h3>
                      
                      <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-3 sm:mb-4 lg:mb-6">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">$5.99</div>
                          <div className="text-gray-600 font-medium text-sm sm:text-base">USD</div>
                        </div>
                        <div className="text-2xl sm:text-3xl text-gray-400 font-light">o</div>
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-600">Bs. 220</div>
                          <div className="text-gray-600 font-medium text-sm sm:text-base">VES</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-center mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base px-2 sm:px-4">
                        Solo pagas por quien capacitas
                      </p>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 mx-auto w-full max-w-sm lg:max-w-md">
                        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg">
                          <span className="text-xl sm:text-2xl">✅</span>
                          Incluye
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">1 curso completo vía WhatsApp</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">1 simulación de phishing práctica</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">Reportes de progreso (si es para equipos)</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-center mt-2 sm:mt-3 lg:mt-4">
                      <p className="text-blue-600 font-medium text-xs sm:text-sm animate-pulse flex items-center gap-2">
                        <span>👆</span>
                        Haz clic para ver métodos de pago
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reverso de la tarjeta */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-2xl border-2 border-green-200 shadow-xl overflow-hidden">
                  <div className="h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex justify-between items-start">
                      <div className="animate-bounce">
                        <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                      </div>
                      <div></div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center justify-center gap-3">
                        <span className="text-2xl sm:text-3xl">💳</span>
                        <span className="text-center">Métodos de Pago</span>
                      </h3>

                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 mx-auto w-full max-w-sm">
                        <ul className="space-y-3 sm:space-y-4">
                          <li className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg sm:text-xl">💳</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-gray-900 font-semibold text-sm sm:text-base">PayPal</span>
                              <p className="text-gray-600 text-xs">Procesamiento automático</p>
                            </div>
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg sm:text-xl">📱</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-gray-900 font-semibold text-sm sm:text-base">Pago Móvil (Venezuela)</span>
                              <p className="text-gray-600 text-xs">Verificación manual</p>
                            </div>
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg sm:text-xl">🏦</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-gray-900 font-semibold text-sm sm:text-base">Transferencia Bancaria</span>
                              <p className="text-gray-600 text-xs">Todas las entidades</p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 sm:mt-6 flex justify-center">
                        <a
                          href="#contact"
                          className="inline-block bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-700 transition-all font-medium text-sm sm:text-lg shadow-lg hover:shadow-xl"
                        >
                          Comenzar Ahora
                        </a>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <p className="text-green-600 font-medium text-xs sm:text-sm animate-pulse flex items-center gap-2">
                        <span>👆</span>
                        Haz clic para volver
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-75">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600">
              Estamos aquí para ayudarte. Envíanos tus preguntas o comentarios.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="juan@empresa.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={contactForm.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Mi Empresa S.A."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+58 412 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-lg text-center ${
                  submitMessage.includes('Error') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="filter brightness-0 invert">
                  <NiblionLogo size="md" />
                </div>
                <span className="text-xl font-bold niblion-brand">Niblion</span>
              </div>
              <p className="text-gray-400">
                Educación en ciberseguridad accesible para todos. Desde individuos hasta empresas.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Cómo Funciona</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Iniciar Sesión</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos de Servicio</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Niblion. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
