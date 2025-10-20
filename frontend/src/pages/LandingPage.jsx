import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/i18n.jsx';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { NiblionLogo } from '../components/ui/Logo';
import './LandingPage.css';

export const LandingPage = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
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
            <div className="md:hidden py-4 mobile-menu">
              <div className="flex flex-col space-y-3">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                >
                  {t('landing.nav.features')}
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                >
                  {t('landing.nav.pricing')}
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                >
                  {t('landing.nav.howItWorks')}
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
                >
                  {t('landing.nav.contact')}
                </a>
                <Link
                  to="/login"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center mx-4"
                >
                  {t('landing.login')}
                </Link>
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
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
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
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border-2 border-primary-200 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('landing.pricing.perPerson')}
                </h3>
                <div className="flex items-center justify-center gap-8">
                  <div>
                    <div className="text-5xl font-bold text-primary-600">$5.99</div>
                    <div className="text-gray-600">USD</div>
                  </div>
                  <div className="text-3xl text-gray-400">o</div>
                  <div>
                    <div className="text-5xl font-bold text-primary-600">Bs. 220</div>
                    <div className="text-gray-600">VES</div>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">{t('landing.pricing.perPersonText')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    {t('landing.pricing.includes')}
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-600 mt-1">✓</span>
                      <span className="text-gray-700">{t('landing.pricing.item1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-600 mt-1">✓</span>
                      <span className="text-gray-700">{t('landing.pricing.item2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-600 mt-1">✓</span>
                      <span className="text-gray-700">{t('landing.pricing.item3')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    {t('landing.pricing.paymentMethods')}
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">💳</span>
                      <span className="text-gray-700">PayPal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">📱</span>
                      <span className="text-gray-700">{t('landing.pricing.mobilePayment')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600 mt-1">🏦</span>
                      <span className="text-gray-700">{t('landing.pricing.bankTransfer')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="#contact"
                  className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all font-medium text-lg shadow-lg"
                >
                  {t('landing.pricing.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
