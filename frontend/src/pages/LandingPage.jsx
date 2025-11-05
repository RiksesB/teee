import React from 'react';
import { Link } from 'react-router-dom';
import { NiblionLogo } from '../components/ui/Logo';
import emailjs from '@emailjs/browser';
import { 
  Users, 
  Smartphone, 
  DollarSign, 
  Shield, 
  BarChart3,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Mail,
  Building2,
  Phone,
  Send
} from 'lucide-react';
import './LandingPage.css';

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Para Todos</div>
                      <div className="text-xs text-gray-600">PyMEs, instituciones, familias. Cualquiera puede aprender.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Usa WhatsApp</div>
                      <div className="text-xs text-gray-600">No descargas apps raras. Todo por la app que ya conoces.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-600" />
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
                <MessageCircle className="w-7 h-7 text-white" />
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
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Para Todos los Públicos
              </h3>
              <p className="text-gray-600">
                Desde tu tía que recién empieza a usar el celular, hasta equipos corporativos completos. Contenido adaptado y fácil de entender.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Precio Justo
              </h3>
              <p className="text-gray-600">
                Paga solo por quien capacitas. Sin suscripciones mensuales, sin letra pequeña. Transparencia total.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Reportes Claros
              </h3>
              <p className="text-gray-600">
                Si capacitas a un equipo, obtén métricas sencillas de quién completó el curso y cómo les fue.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tu Privacidad Primero
              </h3>
              <p className="text-gray-600">
                Tus datos son tuyos. No compartimos, no vendemos información. Punto.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Contenido Actualizado
              </h3>
              <p className="text-gray-600">
                Cursos constantemente actualizados con las últimas amenazas y mejores prácticas en ciberseguridad.
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
              Sistema de Créditos
            </h2>
            <p className="text-xl text-gray-600">
              Compra créditos y úsalos cuando quieras. 1 crédito = 1 persona en 1 curso
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Paquete Básico */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10 Créditos</div>
                  <div className="text-gray-600">$5.99 por crédito</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">$59.90</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">10 personas en cualquier curso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Créditos no expiran</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Ideal para equipos pequeños</span>
                  </li>
                </ul>
              </div>

              {/* Paquete Profesional */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-500 shadow-xl p-8 transform scale-105 hover:shadow-2xl transition-all relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Más Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profesional</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">50 Créditos</div>
                  <div className="text-gray-600">$5.49 por crédito</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">$274.50</div>
                  <div className="text-sm text-green-600 font-semibold">Ahorra $25</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">50 personas en cualquier curso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Créditos no expiran</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Reportes detallados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Soporte prioritario</span>
                  </li>
                </ul>
              </div>

              {/* Paquete Empresarial */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-200 shadow-lg p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresarial</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">100+ Créditos</div>
                  <div className="text-gray-600">Precio personalizado</div>
                  <div className="text-3xl font-bold text-gray-900 mt-2">Cotizar</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">100+ personas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Descuentos por volumen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Cuenta ejecutiva dedicada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Contenido personalizado</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 shadow-lg p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  Método de Pago
                </h3>
                <p className="text-gray-600">Procesamiento seguro y confiable</p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">PayPal</h4>
                    <p className="text-gray-600 text-sm">Pago instantáneo y seguro</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Procesamiento automático</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Créditos disponibles inmediatamente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Protección al comprador</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
                >
                  Comprar Créditos
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  ¿Necesitas otro método de pago? <a href="#contact" className="text-blue-600 hover:underline">Contáctanos</a>
                </p>
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

          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Niblion. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
