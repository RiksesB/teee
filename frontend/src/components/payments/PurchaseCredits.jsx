import React, { useState } from 'react';
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
      alert('Error al procesar el pago');
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
      alert('Pago registrado. Pendiente de confirmación.');
      onSuccess?.();
    } catch (error) {
      alert('Error al procesar el pago');
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
      alert('Pago registrado. Pendiente de confirmación.');
      onSuccess?.();
    } catch (error) {
      alert('Error al procesar el pago');
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adquirir Créditos</h2>
        <p className="text-gray-600 mb-6">Selecciona la cantidad de personas y método de pago</p>

        <div className="space-y-6">
          {/* Número de personas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Personas
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
              Precio por persona: {currency === CURRENCIES.USD ? '$' : 'Bs. '}{priceInfo.pricePerPerson}
            </p>
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda
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
          <div className="bg-gray-75 rounded-lg p-4 border border-gray-150">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total:</span>
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
            Siguiente →
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
        ← Volver
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Método de Pago</h2>
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
              <div className="font-semibold text-gray-900">PayPal</div>
              <div className="text-sm text-gray-500">Pago instantáneo con tarjeta o cuenta PayPal</div>
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
                <div className="font-semibold text-gray-900">Pago Móvil</div>
                <div className="text-sm text-gray-500">Transferencia desde tu banco móvil</div>
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
              <div className="font-semibold text-gray-900">Transferencia Bancaria</div>
              <div className="text-sm text-gray-500">Transferencia directa a cuenta bancaria</div>
            </div>
          </div>
        </button>
      </div>

      {/* Formularios específicos */}
      {paymentMethod === PAYMENT_METHODS.MOBILE_PAYMENT && (
        <div className="space-y-4 bg-gray-75 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Datos del Pago Móvil</h3>
          <input
            type="tel"
            placeholder="Teléfono (04XX-XXXXXXX)"
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
            placeholder="Número de referencia"
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
        <div className="space-y-4 bg-gray-75 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Datos de Transferencia</h3>
          
          {/* Info bancaria de Niblion */}
          {bankingInfo && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-primary-900 mb-2">Datos Bancarios</h4>
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
            placeholder="Nombre del banco"
            value={bankTransferData.bankName}
            onChange={(e) => setBankTransferData({ ...bankTransferData, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Titular de la cuenta"
            value={bankTransferData.accountHolder}
            onChange={(e) => setBankTransferData({ ...bankTransferData, accountHolder: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Número de referencia"
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
              Cargar Comprobante
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
            Procesando...
          </>
        ) : (
          'Proceder al Pago'
        )}
      </button>
    </div>
  );
};
