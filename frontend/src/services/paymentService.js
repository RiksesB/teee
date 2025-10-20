import api from './api';

// Métodos de pago disponibles
export const PAYMENT_METHODS = {
  PAYPAL: 'paypal',
  MOBILE_PAYMENT: 'mobile_payment',
  BANK_TRANSFER: 'bank_transfer',
};

// Monedas soportadas
export const CURRENCIES = {
  USD: 'USD',
  VES: 'VES', // Bolívares
};

// Precios por persona (ajustar según necesidad)
export const PRICING = {
  pricePerPerson: {
    USD: 5.99,  // Dólares
    VES: 220,   // Bolívares (ejemplo, ajustar según tasa)
  },
};

/**
 * Calcula el precio total basado en cantidad de personas y moneda
 */
export const calculatePrice = (numberOfPeople, currency = CURRENCIES.USD) => {
  const pricePerPerson = PRICING.pricePerPerson[currency];
  return {
    subtotal: pricePerPerson * numberOfPeople,
    currency,
    numberOfPeople,
    pricePerPerson,
  };
};

/**
 * Inicia proceso de pago con PayPal
 */
export const initiatePayPalPayment = async (numberOfPeople, currency = CURRENCIES.USD) => {
  try {
    const response = await api.post('/payments/paypal/create', {
      numberOfPeople,
      currency,
      amount: calculatePrice(numberOfPeople, currency).subtotal,
    });
    return response.data;
  } catch (error) {
    console.error('Error iniciando pago PayPal:', error);
    throw error;
  }
};

/**
 * Registra pago móvil (Pago Móvil Venezuela)
 */
export const registerMobilePayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/mobile-payment', {
      numberOfPeople: paymentData.numberOfPeople,
      currency: CURRENCIES.VES,
      amount: calculatePrice(paymentData.numberOfPeople, CURRENCIES.VES).subtotal,
      paymentDetails: {
        phone: paymentData.phone,
        bank: paymentData.bank,
        referenceNumber: paymentData.referenceNumber,
        date: paymentData.date,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registrando pago móvil:', error);
    throw error;
  }
};

/**
 * Registra transferencia bancaria
 */
export const registerBankTransfer = async (transferData) => {
  try {
    const response = await api.post('/payments/bank-transfer', {
      numberOfPeople: transferData.numberOfPeople,
      currency: transferData.currency,
      amount: calculatePrice(transferData.numberOfPeople, transferData.currency).subtotal,
      transferDetails: {
        bankName: transferData.bankName,
        accountHolder: transferData.accountHolder,
        referenceNumber: transferData.referenceNumber,
        date: transferData.date,
        receiptFile: transferData.receiptFile, // Base64 o URL
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error registrando transferencia:', error);
    throw error;
  }
};

/**
 * Verifica estado de un pago
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error verificando pago:', error);
    throw error;
  }
};

/**
 * Obtiene historial de pagos del cliente
 */
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/history');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
};

/**
 * Obtiene información bancaria de Niblion para transferencias
 */
export const getBankingInfo = async (currency) => {
  try {
    const response = await api.get(`/payments/banking-info/${currency}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo info bancaria:', error);
    throw error;
  }
};
