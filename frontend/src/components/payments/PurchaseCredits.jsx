import React, { useState } from 'react';
import { useTranslation } from '../../utils/i18n.jsx';
import {
  PAYMENT_METHODS,
  CURRENCIES,
  calculatePrice,
  initiatePayPalPayment,
  registerMobilePayment,
  registerBankTransfer,
  getBankingInfo,
} from '../../services/paymentService';

export const PurchaseCredits = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Configurar, 2: Pagar
  const [numberOfPeople, setNumberOfPeople] = useState(10);
  const [currency, setCurrency] = useState(CURRENCIES.USD);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYPAL);
  const [loading, setLoading] = useState(false);
  const [bankingInfo, setBankingInfo] = useState(null);
  
  // Formularios específicos por método de pago
  const [mobilePaymentData, setMobilePaymentData] = useState({
    phone: '',
    bank: '',
    referenceNumber: '',
    date: '',
  });
  
  const [bankTransferData, setBankTransferData] = useState({
    bankName: '',
    accountHolder: '',
    referenceNumber: '',
    date: '',
    receiptFile: null,
  });

  const priceInfo = calculatePrice(numberOfPeople, currency);

  const handlePaymentMethodChange = async (method) => {
    setPaymentMethod(method);
    
    // Si es transferencia bancaria, cargar info bancaria
    if (method === PAYMENT_METHODS.BANK_TRANSFER) {
      const info = await getBankingInfo(currency);
      setBankingInfo(info.data);
    }
  };

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const result = await initiatePayPalPayment(numberOfPeople, currency);
      // Redirigir a PayPal
      window.location.href = result.data.approvalUrl;
    } catch (error) {
      alert(t('payments.paymentError'));
      setLoading(false);
    }
  };

  const handleMobilePayment = async () => {
    setLoading(true);
    try {
      await registerMobilePayment({
        numberOfPeople,
        ...mobilePaymentData,
      });
      alert(t('payments.paymentPending'));
      onSuccess?.();
    } catch (error) {
      alert(t('payments.paymentError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    setLoading(true);
    try {
      await registerBankTransfer({
        numberOfPeople,
        currency,
        ...bankTransferData,
      });
      alert(t('payments.paymentPending'));
      onSuccess?.();
    } catch (error) {
      alert(t('payments.paymentError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    switch (paymentMethod) {
      case PAYMENT_METHODS.PAYPAL:
        return handlePayPal();
      case PAYMENT_METHODS.MOBILE_PAYMENT:
        return handleMobilePayment();
      case PAYMENT_METHODS.BANK_TRANSFER:
        return handleBankTransfer();
      default:
        return;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankTransferData({ ...bankTransferData, receiptFile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (step === 1) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('payments.title')}</h2>
        <p className="text-gray-600 mb-6">{t('payments.subtitle')}</p>

        <div className="space-y-6">
          {/* Número de personas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('payments.numberOfPeople')}
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('client.pricePerPerson')}: {currency === CURRENCIES.USD ? '$' : 'Bs. '}{priceInfo.pricePerPerson}
            </p>
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('payments.currency')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrency(CURRENCIES.USD)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  currency === CURRENCIES.USD
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">💵</div>
                <div className="font-semibold">USD - Dólares</div>
              </button>
              <button
                onClick={() => setCurrency(CURRENCIES.VES)}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  currency === CURRENCIES.VES
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🇻🇪</div>
                <div className="font-semibold">VES - Bolívares</div>
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{t('payments.total')}:</span>
              <span className="text-3xl font-bold text-primary-600">
                {currency === CURRENCIES.USD ? '$' : 'Bs. '}{priceInfo.subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {numberOfPeople} {numberOfPeople === 1 ? 'persona' : 'personas'} × {currency === CURRENCIES.USD ? '$' : 'Bs. '}{priceInfo.pricePerPerson}
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={numberOfPeople < 1}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <button
        onClick={() => setStep(1)}
        className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
      >
        ← {t('common.back')}
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('payments.paymentMethod')}</h2>
      <p className="text-gray-600 mb-6">
        Total: {currency === CURRENCIES.USD ? '$' : 'Bs. '}{priceInfo.subtotal.toFixed(2)}
      </p>

      {/* Selector de método de pago */}
      <div className="space-y-4 mb-6">
        {/* PayPal */}
        <button
          onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.PAYPAL)}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
            paymentMethod === PAYMENT_METHODS.PAYPAL
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">💳</div>
            <div>
              <div className="font-semibold text-gray-900">{t('payments.paypal')}</div>
              <div className="text-sm text-gray-500">{t('payments.paypalInstructions')}</div>
            </div>
          </div>
        </button>

        {/* Pago Móvil */}
        {currency === CURRENCIES.VES && (
          <button
            onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.MOBILE_PAYMENT)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
              paymentMethod === PAYMENT_METHODS.MOBILE_PAYMENT
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">📱</div>
              <div>
                <div className="font-semibold text-gray-900">{t('payments.mobilePayment')}</div>
                <div className="text-sm text-gray-500">{t('payments.mobileInstructions')}</div>
              </div>
            </div>
          </button>
        )}

        {/* Transferencia Bancaria */}
        <button
          onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.BANK_TRANSFER)}
          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
            paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏦</div>
            <div>
              <div className="font-semibold text-gray-900">{t('payments.bankTransfer')}</div>
              <div className="text-sm text-gray-500">{t('payments.transferInstructions')}</div>
            </div>
          </div>
        </button>
      </div>

      {/* Formularios específicos */}
      {paymentMethod === PAYMENT_METHODS.MOBILE_PAYMENT && (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Datos del Pago Móvil</h3>
          <input
            type="tel"
            placeholder={t('payments.mobilePhone')}
            value={mobilePaymentData.phone}
            onChange={(e) => setMobilePaymentData({ ...mobilePaymentData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={mobilePaymentData.bank}
            onChange={(e) => setMobilePaymentData({ ...mobilePaymentData, bank: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccionar banco</option>
            <option value="0102">Banco de Venezuela</option>
            <option value="0134">Banesco</option>
            <option value="0108">BBVA Provincial</option>
            <option value="0105">Mercantil</option>
            <option value="0191">BNC</option>
          </select>
          <input
            type="text"
            placeholder={t('payments.mobileReference')}
            value={mobilePaymentData.referenceNumber}
            onChange={(e) => setMobilePaymentData({ ...mobilePaymentData, referenceNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="date"
            value={mobilePaymentData.date}
            onChange={(e) => setMobilePaymentData({ ...mobilePaymentData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && (
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Datos de Transferencia</h3>
          
          {/* Info bancaria de Niblion */}
          {bankingInfo && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-primary-900 mb-2">{t('payments.bankingInfo')}</h4>
              <div className="text-sm text-primary-800 space-y-1">
                <p><strong>Banco:</strong> {bankingInfo.bankName}</p>
                <p><strong>Titular:</strong> {bankingInfo.accountHolder}</p>
                <p><strong>Cuenta:</strong> {bankingInfo.accountNumber}</p>
                <p><strong>RIF:</strong> {bankingInfo.taxId}</p>
              </div>
            </div>
          )}
          
          <input
            type="text"
            placeholder={t('payments.bankName')}
            value={bankTransferData.bankName}
            onChange={(e) => setBankTransferData({ ...bankTransferData, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder={t('payments.accountHolder')}
            value={bankTransferData.accountHolder}
            onChange={(e) => setBankTransferData({ ...bankTransferData, accountHolder: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder={t('payments.bankReference')}
            value={bankTransferData.referenceNumber}
            onChange={(e) => setBankTransferData({ ...bankTransferData, referenceNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="date"
            value={bankTransferData.date}
            onChange={(e) => setBankTransferData({ ...bankTransferData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('payments.uploadReceipt')}
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('payments.processing')}
          </>
        ) : (
          t('payments.proceedToPayment')
        )}
      </button>
    </div>
  );
};
