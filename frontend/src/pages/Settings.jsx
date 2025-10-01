import React, { useState, useEffect } from 'react';
import { 
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  PhoneIcon,
  CloudIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function Settings() {
  const [config, setConfig] = useState({
    whatsapp: {
      verifyToken: '',
      accessToken: '',
      phoneNumberId: '',
      appId: '',
      appSecret: ''
    },
    database: {
      connectionString: '',
      databaseName: '',
      maxConnections: 10
    },
    system: {
      sessionTimeout: 30,
      maxConcurrentSessions: 100,
      enableLogging: true,
      logLevel: 'info'
    },
    notifications: {
      enableEmailAlerts: false,
      adminEmail: '',
      alertThresholds: {
        errorRate: 5,
        responseTime: 2000
      }
    }
  });

  const [saving, setSaving] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [showSecrets, setShowSecrets] = useState({});

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(prevConfig => ({
        ...prevConfig,
        ...data
      }));
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          config: config[section]
        }),
      });

      if (response.ok) {
        alert('Configuración guardada exitosamente');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (service) => {
    setTestResults(prev => ({ ...prev, [service]: { testing: true } }));
    
    try {
      const response = await fetch(`/api/test/${service}`, {
        method: 'POST'
      });
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [service]: {
          testing: false,
          success: response.ok,
          message: result.message || (response.ok ? 'Conexión exitosa' : 'Error de conexión')
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [service]: {
          testing: false,
          success: false,
          message: 'Error de red'
        }
      }));
    }
  };

  const toggleSecret = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const SecretInput = ({ label, value, onChange, fieldKey, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showSecrets[fieldKey] ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="input-field pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => toggleSecret(fieldKey)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showSecrets[fieldKey] ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );

  const TestButton = ({ service, label }) => (
    <button
      onClick={() => testConnection(service)}
      disabled={testResults[service]?.testing}
      className="btn-secondary btn-sm"
    >
      {testResults[service]?.testing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          Probando...
        </>
      ) : (
        <>
          <PhoneIcon className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </button>
  );

  const TestResult = ({ service }) => {
    const result = testResults[service];
    if (!result || result.testing) return null;

    return (
      <div className={`mt-2 p-2 rounded-md text-sm ${
        result.success 
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        <div className="flex items-center">
          {result.success ? (
            <CheckCircleIcon className="h-4 w-4 mr-2" />
          ) : (
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
          )}
          {result.message}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Configuración
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra la configuración del sistema y servicios externos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* WhatsApp Configuration */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PhoneIcon className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                WhatsApp Business API
              </h3>
            </div>
            <TestButton service="whatsapp" label="Probar Conexión" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verify Token
              </label>
              <input
                type="text"
                value={config.whatsapp.verifyToken}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, verifyToken: e.target.value }
                }))}
                className="input-field"
                placeholder="Token de verificación del webhook"
              />
            </div>

            <SecretInput
              label="Access Token"
              value={config.whatsapp.accessToken}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                whatsapp: { ...prev.whatsapp, accessToken: e.target.value }
              }))}
              fieldKey="accessToken"
              placeholder="Token de acceso permanente"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number ID
              </label>
              <input
                type="text"
                value={config.whatsapp.phoneNumberId}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, phoneNumberId: e.target.value }
                }))}
                className="input-field"
                placeholder="ID del número de teléfono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App ID
                </label>
                <input
                  type="text"
                  value={config.whatsapp.appId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    whatsapp: { ...prev.whatsapp, appId: e.target.value }
                  }))}
                  className="input-field"
                />
              </div>

              <SecretInput
                label="App Secret"
                value={config.whatsapp.appSecret}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  whatsapp: { ...prev.whatsapp, appSecret: e.target.value }
                }))}
                fieldKey="appSecret"
                placeholder="Secreto de la aplicación"
              />
            </div>
          </div>

          <TestResult service="whatsapp" />

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('whatsapp')}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar WhatsApp'}
            </button>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CircleStackIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Base de Datos
              </h3>
            </div>
            <TestButton service="database" label="Probar Conexión" />
          </div>
          
          <div className="space-y-4">
            <SecretInput
              label="Cadena de Conexión"
              value={config.database.connectionString}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                database: { ...prev.database, connectionString: e.target.value }
              }))}
              fieldKey="connectionString"
              placeholder="mongodb://localhost:27017"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Base de Datos
              </label>
              <input
                type="text"
                value={config.database.databaseName}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  database: { ...prev.database, databaseName: e.target.value }
                }))}
                className="input-field"
                placeholder="niblion_security_training"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximas Conexiones Concurrentes
              </label>
              <input
                type="number"
                value={config.database.maxConnections}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  database: { ...prev.database, maxConnections: parseInt(e.target.value) }
                }))}
                className="input-field"
                min="1"
                max="100"
              />
            </div>
          </div>

          <TestResult service="database" />

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('database')}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar Base de Datos'}
            </button>
          </div>
        </div>

        {/* System Configuration */}
        <div className="card">
          <div className="flex items-center mb-4">
            <CogIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Sistema
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout de Sesión (minutos)
              </label>
              <input
                type="number"
                value={config.system.sessionTimeout}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  system: { ...prev.system, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="input-field"
                min="5"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximas Sesiones Concurrentes
              </label>
              <input
                type="number"
                value={config.system.maxConcurrentSessions}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  system: { ...prev.system, maxConcurrentSessions: parseInt(e.target.value) }
                }))}
                className="input-field"
                min="10"
                max="1000"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableLogging"
                checked={config.system.enableLogging}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  system: { ...prev.system, enableLogging: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableLogging" className="ml-2 block text-sm text-gray-900">
                Habilitar logging detallado
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Log
              </label>
              <select
                value={config.system.logLevel}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  system: { ...prev.system, logLevel: e.target.value }
                }))}
                className="input-field"
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('system')}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar Sistema'}
            </button>
          </div>
        </div>

        {/* Notifications Configuration */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BellIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Notificaciones
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableEmailAlerts"
                checked={config.notifications.enableEmailAlerts}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, enableEmailAlerts: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableEmailAlerts" className="ml-2 block text-sm text-gray-900">
                Habilitar alertas por email
              </label>
            </div>

            {config.notifications.enableEmailAlerts && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del Administrador
                  </label>
                  <input
                    type="email"
                    value={config.notifications.adminEmail}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, adminEmail: e.target.value }
                    }))}
                    className="input-field"
                    placeholder="admin@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Errores (%)
                  </label>
                  <input
                    type="number"
                    value={config.notifications.alertThresholds.errorRate}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        alertThresholds: {
                          ...prev.notifications.alertThresholds,
                          errorRate: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="input-field"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umbral de Tiempo de Respuesta (ms)
                  </label>
                  <input
                    type="number"
                    value={config.notifications.alertThresholds.responseTime}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        alertThresholds: {
                          ...prev.notifications.alertThresholds,
                          responseTime: parseInt(e.target.value)
                        }
                      }
                    }))}
                    className="input-field"
                    min="500"
                    max="10000"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleSave('notifications')}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Guardando...' : 'Guardar Notificaciones'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-red-900">
            Zona Peligrosa
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">
              Las siguientes acciones son irreversibles y pueden afectar el funcionamiento del sistema.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                if (confirm('¿Estás seguro de que quieres reiniciar todas las sesiones activas?')) {
                  fetch('/api/admin/reset-sessions', { method: 'POST' });
                }
              }}
              className="btn-secondary border-red-300 text-red-700 hover:bg-red-50"
            >
              Reiniciar Todas las Sesiones
            </button>
            
            <button 
              onClick={() => {
                if (confirm('¿Estás seguro de que quieres limpiar todos los logs del sistema?')) {
                  fetch('/api/admin/clear-logs', { method: 'POST' });
                }
              }}
              className="btn-secondary border-red-300 text-red-700 hover:bg-red-50"
            >
              Limpiar Logs del Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}