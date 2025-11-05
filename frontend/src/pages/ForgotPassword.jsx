import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NiblionLogo } from '../components/ui/Logo';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generar un código de recuperación temporal
      const recoveryCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Enviar email con EmailJS
      await emailjs.send(
        'service_4gdhn2h',
        'template_o4p276m',
        {
          to_email: email,
          from_name: 'Niblion - Recuperación de Contraseña',
          message: `Has solicitado restablecer tu contraseña.\n\nCódigo de recuperación: ${recoveryCode}\n\nPor favor, contacta al administrador del sistema en seguridadniblion@gmail.com con este código para restablecer tu contraseña.\n\nSi no solicitaste este cambio, ignora este mensaje.`,
          user_email: email,
          user_name: 'Usuario',
        },
        '-oC-zAWUmZgMJmIuf'
      );

      // También enviar notificación al admin
      await emailjs.send(
        'service_4gdhn2h',
        'template_o4p276m',
        {
          to_email: 'seguridadniblion@gmail.com',
          from_name: 'Sistema Niblion',
          message: `Solicitud de recuperación de contraseña:\n\nEmail: ${email}\nCódigo: ${recoveryCode}\nFecha: ${new Date().toLocaleString('es-ES')}`,
          user_email: email,
          user_name: 'Sistema Automático',
        },
        '-oC-zAWUmZgMJmIuf'
      );

      setSuccess(true);
    } catch (error) {
      console.error('Error al enviar email:', error);
      setError('Error al enviar el correo. Por favor, intenta nuevamente o contacta a seguridadniblion@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-green-600 flex justify-center mb-4">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              ¡Correo Enviado!
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Hemos enviado las instrucciones de recuperación a tu correo electrónico y al equipo de soporte.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Próximos pasos:</strong><br/>
                1. Revisa tu bandeja de entrada y spam<br/>
                2. Guarda el código de recuperación<br/>
                3. Contacta a seguridadniblion@gmail.com con tu código
              </p>
            </div>
            <Link
              to="/login"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Botón volver */}
        <div className="flex justify-start items-center">
          <Link 
            to="/login" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Volver al login
          </Link>
        </div>

        {/* Logo y Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <NiblionLogo size="xxl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña
          </p>
        </div>

        {/* Formulario */}
        <div className="mt-6 sm:mt-8 bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-800 rounded-lg p-3 sm:p-4 text-sm">
                <div className="flex">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-danger-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="tu@empresa.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Enviar Instrucciones
                </span>
              )}
            </button>

            {/* Información adicional */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> Recibirás un código de recuperación por email. 
                Para restablecer tu contraseña, deberás contactar al administrador en{' '}
                <a href="mailto:seguridadniblion@gmail.com" className="font-semibold underline">
                  seguridadniblion@gmail.com
                </a> con tu código.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          © 2025 Niblion. Plataforma de Concienciación en Ciberseguridad.
        </p>
      </div>
    </div>
  );
};
