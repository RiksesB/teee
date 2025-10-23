import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/i18n.jsx';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { NiblionLogo } from '../components/ui/Logo';
import './LandingPage.css';

export const LandingPage = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCardFlipped, setIsCardFlipped] = React.useState(false);

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
                {t('landing.nav.features')}
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('landing.nav.pricing')}
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('landing.nav.howItWorks')}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('landing.nav.contact')}
              </a>
              <LanguageSelector />
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {t('landing.login')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSelector />
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
                  {t('landing.nav.features')}
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  {t('landing.nav.pricing')}
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  {t('landing.nav.howItWorks')}
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-blue-700 transition-colors px-6 py-3 font-medium"
                >
                  {t('landing.nav.contact')}
                </a>
                <div className="px-6 py-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center shadow-md"
                  >
                    {t('landing.login')}
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
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all text-center font-medium text-lg shadow-lg hover:shadow-xl cta-pulse"
                >
                  {t('landing.hero.cta')}
                </a>
                <a
                  href="#how-it-works"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all text-center font-medium text-lg"
                >
                  {t('landing.hero.learnMore')}
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="animate-fade-in-up">
                  <div className="text-3xl font-bold text-primary-600 stat-number">98%</div>
                  <div className="text-sm text-gray-600">{t('landing.stats.awareness')}</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="text-3xl font-bold text-primary-600 stat-number">50K+</div>
                  <div className="text-sm text-gray-600">{t('landing.stats.trained')}</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="text-3xl font-bold text-primary-600 stat-number">200+</div>
                  <div className="text-sm text-gray-600">{t('landing.stats.companies')}</div>
                </div>
              </div>
            </div>

            <div className="relative float-animation">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Capacitación en WhatsApp</div>
                      <div className="text-xs text-gray-600">Accede a cursos directamente desde tu chat favorito, sin apps adicionales</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Mayor Eficiencia</div>
                      <div className="text-xs text-gray-600">Reduce el tiempo de capacitación en un 60% con simulaciones interactivas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 mb-1">Asistente IA 24/7</div>
                      <div className="text-xs text-gray-600">Chatbot inteligente que responde dudas y guía el aprendizaje</div>
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
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl border border-primary-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature1.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature1.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card bg-gradient-to-br from-secondary-50 to-white p-8 rounded-2xl border border-secondary-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-secondary-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature2.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature2.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature3.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature3.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature4.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature4.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature5.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature5.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature6.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.features.feature6.description')}
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
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.howItWorks.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.howItWorks.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.howItWorks.step3.description')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('landing.howItWorks.step4.title')}
              </h3>
              <p className="text-gray-600">
                {t('landing.howItWorks.step4.description')}
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
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Flip Card Container */}
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
                    {/* Header con indicador */}
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

                    {/* Contenido principal */}
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-center">
                        {t('landing.pricing.perPerson')}
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
                        {t('landing.pricing.perPersonText')}
                      </p>

                      {/* Incluye */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 mx-auto w-full max-w-sm lg:max-w-md">
                        <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg">
                          <span className="text-xl sm:text-2xl">✅</span>
                          {t('landing.pricing.includes')}
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">{t('landing.pricing.item1')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">{t('landing.pricing.item2')}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5 font-bold text-sm">✓</span>
                            <span className="text-gray-700 text-xs sm:text-sm lg:text-base">{t('landing.pricing.item3')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Footer con indicativo */}
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
                    {/* Header con indicador */}
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

                    {/* Contenido principal */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center justify-center gap-3">
                        <span className="text-2xl sm:text-3xl">💳</span>
                        <span className="text-center">{t('landing.pricing.paymentMethods')}</span>
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
                              <span className="text-gray-900 font-semibold text-sm sm:text-base">{t('landing.pricing.mobilePayment')}</span>
                              <p className="text-gray-600 text-xs">Verificación manual</p>
                            </div>
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg sm:text-xl">🏦</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-gray-900 font-semibold text-sm sm:text-base">{t('landing.pricing.bankTransfer')}</span>
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
                          {t('landing.pricing.cta')}
                        </a>
                      </div>
                    </div>

                    {/* Footer con indicativo */}
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
              {t('landing.contact.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('landing.contact.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.name')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('landing.contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.email')}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('landing.contact.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.company')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('landing.contact.companyPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.phone')}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+58 412 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('landing.contact.message')}
                </label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('landing.contact.messagePlaceholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
              >
                {t('landing.contact.send')}
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">📧</div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <a href="mailto:contacto@niblion.com" className="text-primary-600 hover:text-primary-700">
                    contacto@niblion.com
                  </a>
                </div>
                <div>
                  <div className="text-3xl mb-2">📱</div>
                  <div className="font-semibold text-gray-900">WhatsApp</div>
                  <a href="https://wa.me/584121234567" className="text-primary-600 hover:text-primary-700">
                    +58 412 123 4567
                  </a>
                </div>
                <div>
                  <div className="text-3xl mb-2">🌐</div>
                  <div className="font-semibold text-gray-900">Web</div>
                  <a href="https://niblion.com" className="text-primary-600 hover:text-primary-700">
                    www.niblion.com
                  </a>
                </div>
              </div>
            </div>
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
                {t('landing.footer.description')}
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.product')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t('landing.nav.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('landing.nav.pricing')}</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('landing.nav.howItWorks')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.company')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contact" className="hover:text-white transition-colors">{t('landing.nav.contact')}</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">{t('landing.login')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t('landing.footer.legal')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('landing.footer.terms')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Niblion. {t('landing.footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
