import { createContext, useContext, useState } from 'react';

// Sistema de internacionalización simple
// Para producción, considerar react-i18next

const translations = {
  en: {
    // Landing Page
    landing: {
      nav: {
        features: "Features",
        pricing: "Pricing",
        howItWorks: "How it Works",
        contact: "Contact",
      },
      login: "Sign In",
      
      hero: {
        title: "Protect Your Team from Phishing",
        subtitle: "Train your organization with interactive courses via WhatsApp and real phishing simulations. Reduce risks and increase security awareness.",
        cta: "Request Free Demo",
        learnMore: "Learn More",
      },
      
      stats: {
        awareness: "Awareness improvement",
        trained: "People trained",
        companies: "Companies trust us",
      },
      
      features: {
        title: "Everything You Need to Protect Your Organization",
        subtitle: "A complete platform to train, simulate, and measure your team's resilience against phishing attacks.",
        
        feature1: {
          title: "WhatsApp Courses",
          description: "Interactive training sent directly to WhatsApp. Short and effective modules your team completes in minutes.",
        },
        feature2: {
          title: "Real Simulations",
          description: "Simulated phishing campaigns with Gophish to assess your team's vulnerability in real situations.",
        },
        feature3: {
          title: "Detailed Reports",
          description: "Complete analytics with progress metrics, success rates, and improvement areas for each employee and department.",
        },
        feature4: {
          title: "Pay per Person",
          description: "Flexible model: only pay for each person trained. Includes complete course and phishing simulation.",
        },
        feature5: {
          title: "Multi-language",
          description: "Platform available in Spanish and English. Courses adapted to your preferred language.",
        },
        feature6: {
          title: "Guaranteed Security",
          description: "Encrypted data, international compliance, and total privacy for your organization.",
        },
      },
      
      howItWorks: {
        title: "How Does it Work?",
        subtitle: "Protect your organization in 4 simple steps",
        
        step1: {
          title: "Register and Buy Credits",
          description: "Create your account and purchase credits based on the number of people to train.",
        },
        step2: {
          title: "Configure Your Campaign",
          description: "Select the course, add WhatsApp numbers, and schedule sending.",
        },
        step3: {
          title: "Your Team Learns",
          description: "Employees receive interactive modules via WhatsApp and complete assessments.",
        },
        step4: {
          title: "Simulate and Measure",
          description: "Launch phishing simulations and get detailed progress reports.",
        },
      },
      
      pricing: {
        title: "Simple and Transparent Pricing",
        subtitle: "No complicated plans. Pay only for what you need.",
        perPerson: "Per Person",
        perPersonText: "Price per trained employee",
        includes: "Includes",
        item1: "1 complete WhatsApp course",
        item2: "1 phishing simulation with Gophish",
        item3: "Reports and detailed analytics",
        paymentMethods: "Payment Methods",
        mobilePayment: "Mobile Payment (Venezuela)",
        bankTransfer: "Bank Transfer",
        cta: "Get Started Now",
      },
      
      contact: {
        title: "Contact Us",
        subtitle: "We're here to help. Request a demo or resolve your questions.",
        name: "Full Name",
        namePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "john@company.com",
        company: "Company",
        companyPlaceholder: "My Company Inc.",
        phone: "Phone",
        message: "Message",
        messagePlaceholder: "Tell us how we can help you...",
        send: "Send Message",
      },
      
      footer: {
        description: "Leading platform for anti-phishing training for companies.",
        product: "Product",
        company: "Company",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        rights: "All rights reserved.",
      },
    },
    
    // Authentication
    auth: {
      loginTitle: "Sign In to Niblion",
      loginSubtitle: "Cybersecurity Awareness Platform",
      emailPlaceholder: "your@company.com",
      passwordPlaceholder: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot your password?",
      loginButton: "Sign in",
      invalidCredentials: "Invalid credentials",
      loggingIn: "Signing in...",
    },
    
    // Common
    common: {
      loading: "Loading...",
      error: "Error loading data",
      retry: "Retry",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View details",
      logout: "Sign out",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
      download: "Download",
      upload: "Upload",
      back: "Back",
      next: "Next",
      previous: "Previous",
      confirm: "Confirm",
      close: "Close",
    },
    
    // Client Dashboard
    client: {
      dashboard: "My Dashboard",
      welcomeMessage: "Welcome, {name}",
      peopleAvailable: "People Credits Available",
      activeCampaigns: "Active Campaigns",
      completedCourses: "Completed Courses",
      successRate: "Success Rate",
      catalog: "Course Catalog",
      myCampaigns: "My Campaigns",
      tracking: "Tracking",
      buyCredits: "Buy More Credits",
      createCampaign: "New Campaign",
      pricePerPerson: "Price per person",
      totalPeople: "Total people",
      calculatePrice: "Calculate price",
    },
    
    // Admin Dashboard
    admin: {
      dashboard: "Admin Panel",
      totalClients: "Total Clients",
      activeCredits: "Active Credits",
      availableCourses: "Available Courses",
      manageCourses: "Course Management",
      manageClients: "Client Management",
      reports: "Reports & Analytics",
      pendingPayments: "Pending Payments",
      approvePayment: "Approve",
      rejectPayment: "Reject",
    },
    
    // Payments
    payments: {
      title: "Purchase Credits",
      subtitle: "Buy credits to send courses to your team",
      paymentMethod: "Payment Method",
      paypal: "PayPal",
      mobilePayment: "Mobile Payment (Venezuela)",
      bankTransfer: "Bank Transfer",
      currency: "Currency",
      numberOfPeople: "Number of people",
      total: "Total",
      proceedToPayment: "Proceed to Payment",
      
      // PayPal
      paypalInstructions: "You will be redirected to PayPal to complete your payment",
      
      // Mobile Payment
      mobilePhone: "Phone Number",
      mobileBank: "Bank",
      mobileReference: "Reference Number",
      mobileDate: "Payment Date",
      mobileInstructions: "Transfer to Pago Móvil and enter the reference number",
      
      // Bank Transfer
      bankName: "Bank Name",
      accountHolder: "Account Holder",
      bankReference: "Reference Number",
      transferDate: "Transfer Date",
      uploadReceipt: "Upload Receipt",
      bankingInfo: "Banking Information",
      transferInstructions: "Transfer to one of our accounts and upload the receipt",
      
      // Status
      pending: "Pending Verification",
      approved: "Approved",
      rejected: "Rejected",
      processing: "Processing",
      
      paymentSuccess: "Payment successful! Credits added to your account",
      paymentPending: "Payment registered. Awaiting verification.",
      paymentError: "Error processing payment. Please try again.",
    },
    
    // Campaigns
    campaigns: {
      create: "Create Campaign",
      name: "Campaign Name",
      selectCourse: "Select Course",
      addPeople: "Add People",
      uploadCSV: "Upload CSV",
      csvFormat: "Format: name,phone,email,department",
      manualEntry: "Manual Entry",
      personName: "Name",
      personPhone: "Phone (with country code)",
      personEmail: "Email",
      personDepartment: "Department",
      addPerson: "Add Person",
      startDate: "Start Date",
      endDate: "End Date",
      summary: "Summary",
      totalPeople: "{count} people",
      creditsRequired: "Credits required: {count}",
      creditsAvailable: "Available: {count}",
      insufficientCredits: "Insufficient credits. Please purchase more.",
      createSuccess: "Campaign created successfully!",
      
      // Tracking
      progress: "Progress",
      notStarted: "Not Started",
      inProgress: "In Progress",
      completed: "Completed",
      failed: "Failed",
      viewDetails: "View Details",
      exportReport: "Export Report",
    },
    
    // Courses
    courses: {
      title: "Course Catalog",
      level: "Level",
      basic: "Basic",
      intermediate: "Intermediate",
      advanced: "Advanced",
      modules: "{count} modules",
      duration: "{time} hours",
      viewDetails: "View Details",
      selectCourse: "Select Course",
      courseContent: "Course Content",
      learningObjectives: "Learning Objectives",
      includedSimulation: "Includes Gophish Simulation",
    },
  },
  
  es: {
    // Landing Page
    landing: {
      nav: {
        features: "Características",
        pricing: "Precios",
        howItWorks: "Cómo Funciona",
        contact: "Contacto",
      },
      login: "Iniciar Sesión",
      
      hero: {
        title: "Protege a tu Equipo del Phishing",
        subtitle: "Capacita a tu organización con cursos interactivos vía WhatsApp y simulaciones reales de phishing. Reduce riesgos y aumenta la concienciación de seguridad.",
        cta: "Solicitar Demo Gratuita",
        learnMore: "Conocer Más",
      },
      
      stats: {
        awareness: "Mejora en concienciación",
        trained: "Personas capacitadas",
        companies: "Empresas confían en nosotros",
      },
      
      features: {
        title: "Todo lo que Necesitas para Proteger tu Organización",
        subtitle: "Una plataforma completa para capacitar, simular y medir la resiliencia de tu equipo contra ataques de phishing.",
        
        feature1: {
          title: "Cursos por WhatsApp",
          description: "Capacitación interactiva enviada directamente a WhatsApp. Módulos cortos y efectivos que tu equipo completa en minutos.",
        },
        feature2: {
          title: "Simulaciones Reales",
          description: "Campañas de phishing simulado con Gophish para evaluar la vulnerabilidad de tu equipo en situaciones reales.",
        },
        feature3: {
          title: "Reportes Detallados",
          description: "Analítica completa con métricas de progreso, tasas de éxito y áreas de mejora para cada empleado y departamento.",
        },
        feature4: {
          title: "Pago por Persona",
          description: "Modelo flexible: solo pagas por cada persona capacitada. Incluye curso completo y simulación de phishing.",
        },
        feature5: {
          title: "Multi-idioma",
          description: "Plataforma disponible en español e inglés. Cursos adaptados a tu idioma preferido.",
        },
        feature6: {
          title: "Seguridad Garantizada",
          description: "Datos encriptados, cumplimiento de normativas internacionales y privacidad total de tu organización.",
        },
      },
      
      howItWorks: {
        title: "¿Cómo Funciona?",
        subtitle: "En 4 simples pasos protege a tu organización",
        
        step1: {
          title: "Regístrate y Adquiere Créditos",
          description: "Crea tu cuenta y compra créditos según el número de personas a capacitar.",
        },
        step2: {
          title: "Configura tu Campaña",
          description: "Selecciona el curso, agrega los números de WhatsApp y programa el envío.",
        },
        step3: {
          title: "Tu Equipo Aprende",
          description: "Los empleados reciben módulos interactivos por WhatsApp y completan evaluaciones.",
        },
        step4: {
          title: "Simula y Mide",
          description: "Lanza simulaciones de phishing y obtén reportes detallados del progreso.",
        },
      },
      
      pricing: {
        title: "Precios Simples y Transparentes",
        subtitle: "Sin planes complicados. Paga solo por lo que necesitas.",
        perPerson: "Por Persona",
        perPersonText: "Precio por empleado capacitado",
        includes: "Incluye",
        item1: "1 curso completo vía WhatsApp",
        item2: "1 simulación de phishing con Gophish",
        item3: "Reportes y analítica detallada",
        paymentMethods: "Métodos de Pago",
        mobilePayment: "Pago Móvil (Venezuela)",
        bankTransfer: "Transferencia Bancaria",
        cta: "Comenzar Ahora",
      },
      
      contact: {
        title: "Contáctanos",
        subtitle: "Estamos aquí para ayudarte. Solicita una demo o resuelve tus dudas.",
        name: "Nombre Completo",
        namePlaceholder: "Juan Pérez",
        email: "Correo Electrónico",
        emailPlaceholder: "juan@empresa.com",
        company: "Empresa",
        companyPlaceholder: "Mi Empresa S.A.",
        phone: "Teléfono",
        message: "Mensaje",
        messagePlaceholder: "Cuéntanos cómo podemos ayudarte...",
        send: "Enviar Mensaje",
      },
      
      footer: {
        description: "Plataforma líder en capacitación contra phishing para empresas.",
        product: "Producto",
        company: "Empresa",
        legal: "Legal",
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio",
        rights: "Todos los derechos reservados.",
      },
    },
    
    // Autenticación
    auth: {
      loginTitle: "Iniciar Sesión en Niblion",
      loginSubtitle: "Plataforma de Concienciación en Ciberseguridad",
      emailPlaceholder: "tu@empresa.com",
      passwordPlaceholder: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Iniciar sesión",
      invalidCredentials: "Credenciales inválidas",
      loggingIn: "Iniciando sesión...",
    },
    
    // Común
    common: {
      loading: "Cargando...",
      error: "Error al cargar los datos",
      retry: "Reintentar",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver detalles",
      logout: "Cerrar sesión",
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      import: "Importar",
      download: "Descargar",
      upload: "Cargar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      confirm: "Confirmar",
      close: "Cerrar",
    },
    
    // Dashboard Cliente
    client: {
      dashboard: "Mi Dashboard",
      welcomeMessage: "Bienvenido, {name}",
      peopleAvailable: "Créditos de Personas Disponibles",
      activeCampaigns: "Campañas Activas",
      completedCourses: "Cursos Completados",
      successRate: "Tasa de Éxito",
      catalog: "Catálogo de Cursos",
      myCampaigns: "Mis Campañas",
      tracking: "Seguimiento",
      buyCredits: "Comprar Más Créditos",
      createCampaign: "Nueva Campaña",
      pricePerPerson: "Precio por persona",
      totalPeople: "Total de personas",
      calculatePrice: "Calcular precio",
    },
    
    // Dashboard Admin
    admin: {
      dashboard: "Panel de Administración",
      totalClients: "Total Clientes",
      activeCredits: "Créditos Activos",
      availableCourses: "Cursos Disponibles",
      manageCourses: "Gestión de Cursos",
      manageClients: "Gestión de Clientes",
      reports: "Reportes y Analíticas",
      pendingPayments: "Pagos Pendientes",
      approvePayment: "Aprobar",
      rejectPayment: "Rechazar",
    },
    
    // Pagos
    payments: {
      title: "Comprar Créditos",
      subtitle: "Compra créditos para enviar cursos a tu equipo",
      paymentMethod: "Método de Pago",
      paypal: "PayPal",
      mobilePayment: "Pago Móvil (Venezuela)",
      bankTransfer: "Transferencia Bancaria",
      currency: "Moneda",
      numberOfPeople: "Número de personas",
      total: "Total",
      proceedToPayment: "Proceder al Pago",
      
      // PayPal
      paypalInstructions: "Serás redirigido a PayPal para completar tu pago",
      
      // Pago Móvil
      mobilePhone: "Número de Teléfono",
      mobileBank: "Banco",
      mobileReference: "Número de Referencia",
      mobileDate: "Fecha de Pago",
      mobileInstructions: "Transfiere a Pago Móvil e ingresa el número de referencia",
      
      // Transferencia
      bankName: "Nombre del Banco",
      accountHolder: "Titular de la Cuenta",
      bankReference: "Número de Referencia",
      transferDate: "Fecha de Transferencia",
      uploadReceipt: "Cargar Comprobante",
      bankingInfo: "Información Bancaria",
      transferInstructions: "Transfiere a una de nuestras cuentas y carga el comprobante",
      
      // Estados
      pending: "Pendiente de Verificación",
      approved: "Aprobado",
      rejected: "Rechazado",
      processing: "Procesando",
      
      paymentSuccess: "¡Pago exitoso! Créditos agregados a tu cuenta",
      paymentPending: "Pago registrado. Esperando verificación.",
      paymentError: "Error procesando el pago. Por favor intenta de nuevo.",
    },
    
    // Campañas
    campaigns: {
      create: "Crear Campaña",
      name: "Nombre de la Campaña",
      selectCourse: "Seleccionar Curso",
      addPeople: "Agregar Personas",
      uploadCSV: "Cargar CSV",
      csvFormat: "Formato: nombre,teléfono,email,departamento",
      manualEntry: "Entrada Manual",
      personName: "Nombre",
      personPhone: "Teléfono (con código de país)",
      personEmail: "Email",
      personDepartment: "Departamento",
      addPerson: "Agregar Persona",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      summary: "Resumen",
      totalPeople: "{count} personas",
      creditsRequired: "Créditos requeridos: {count}",
      creditsAvailable: "Disponibles: {count}",
      insufficientCredits: "Créditos insuficientes. Por favor compra más.",
      createSuccess: "¡Campaña creada exitosamente!",
      
      // Seguimiento
      progress: "Progreso",
      notStarted: "No Iniciado",
      inProgress: "En Progreso",
      completed: "Completado",
      failed: "Fallido",
      viewDetails: "Ver Detalles",
      exportReport: "Exportar Reporte",
    },
    
    // Cursos
    courses: {
      title: "Catálogo de Cursos",
      level: "Nivel",
      basic: "Básico",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      modules: "{count} módulos",
      duration: "{time} horas",
      viewDetails: "Ver Detalles",
      selectCourse: "Seleccionar Curso",
      courseContent: "Contenido del Curso",
      learningObjectives: "Objetivos de Aprendizaje",
      includedSimulation: "Incluye Simulación Gophish",
    },
  },
};

// Context para manejar el idioma
const LanguageContext = createContext();

/**
 * Provider de idioma que envuelve la aplicación
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('niblion_language') || 'es';
  });

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('niblion_language', lang);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation missing: ${key}`);
      return key;
    }
    
    // Reemplazar parámetros {name}, {count}, etc.
    return Object.keys(params).reduce(
      (str, param) => str.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]),
      value
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook personalizado para usar traducciones en componentes
 */
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default { useTranslation, LanguageProvider };
