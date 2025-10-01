import React, { useState, useEffect } from 'react';
import { 
  PlusIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingCampaign, setSendingCampaign] = useState(null);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    phoneNumbers: '',
    moduleId: '1',
    scheduledFor: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      const data = await response.json();
      setCampaigns(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    
    try {
      const phoneList = newCampaign.phoneNumbers
        .split('\n')
        .map(phone => phone.trim())
        .filter(phone => phone.length > 0);

      const response = await fetch('/api/send-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers: phoneList,
          moduleId: newCampaign.moduleId,
          metadata: {
            campaignName: newCampaign.name,
            description: newCampaign.description,
            createdAt: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Campaña enviada exitosamente a ${result.sent} números`);
        setNewCampaign({
          name: '',
          description: '',
          phoneNumbers: '',
          moduleId: '1',
          scheduledFor: ''
        });
        setShowCreateForm(false);
        fetchCampaigns();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error al crear la campaña');
    }
  };

  const handleSendQuickCampaign = async (phoneNumbers, moduleId) => {
    setSendingCampaign(moduleId);
    
    try {
      const response = await fetch('/api/send-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers: phoneNumbers.split('\n').filter(p => p.trim()),
          moduleId: moduleId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Enviado a ${result.sent} números`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Error al enviar campaña');
    } finally {
      setSendingCampaign(null);
    }
  };

  const CampaignCard = ({ campaign }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
        <span className={`badge ${
          campaign.status === 'completed' ? 'badge-success' :
          campaign.status === 'sending' ? 'badge-warning' :
          campaign.status === 'failed' ? 'badge-error' : 'badge-info'
        }`}>
          {campaign.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{campaign.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{campaign.totalRecipients}</div>
          <div className="text-sm text-gray-500">Destinatarios</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{campaign.sent || 0}</div>
          <div className="text-sm text-gray-500">Enviados</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Módulo {campaign.moduleId} • {new Date(campaign.createdAt).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          <button className="btn-secondary btn-sm">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="btn-secondary btn-sm text-red-600 hover:bg-red-50">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const QuickSendForm = () => {
    const [quickNumbers, setQuickNumbers] = useState('');
    const [quickModule, setQuickModule] = useState('1');

    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Envío Rápido
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Números de teléfono (uno por línea)
            </label>
            <textarea
              value={quickNumbers}
              onChange={(e) => setQuickNumbers(e.target.value)}
              rows={6}
              className="input-field"
              placeholder="573001234567&#10;573009876543"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Módulo
            </label>
            <select
              value={quickModule}
              onChange={(e) => setQuickModule(e.target.value)}
              className="input-field"
            >
              <option value="1">Módulo 1 - Seguridad Básica</option>
              <option value="2">Módulo 2 - Phishing</option>
              <option value="3">Módulo 3 - Contraseñas</option>
              <option value="4">Módulo 4 - Redes Sociales</option>
            </select>
          </div>
          
          <button
            onClick={() => handleSendQuickCampaign(quickNumbers, quickModule)}
            disabled={!quickNumbers.trim() || sendingCampaign === quickModule}
            className="btn-primary w-full"
          >
            {sendingCampaign === quickModule ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Enviar Ahora
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Gestor de Campañas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra campañas de concientización en seguridad
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Campaña
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Send Form */}
        <div className="lg:col-span-1">
          <QuickSendForm />
        </div>

        {/* Campaign Creation Form */}
        {showCreateForm && (
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Crear Nueva Campaña
              </h3>
              
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Campaña
                    </label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Módulo
                    </label>
                    <select
                      value={newCampaign.moduleId}
                      onChange={(e) => setNewCampaign({...newCampaign, moduleId: e.target.value})}
                      className="input-field"
                    >
                      <option value="1">Módulo 1 - Seguridad Básica</option>
                      <option value="2">Módulo 2 - Phishing</option>
                      <option value="3">Módulo 3 - Contraseñas</option>
                      <option value="4">Módulo 4 - Redes Sociales</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    rows={3}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Números de teléfono (uno por línea)
                  </label>
                  <textarea
                    value={newCampaign.phoneNumbers}
                    onChange={(e) => setNewCampaign({...newCampaign, phoneNumbers: e.target.value})}
                    rows={8}
                    className="input-field"
                    placeholder="573001234567&#10;573009876543"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Crear y Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Campaigns List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (
                <CampaignCard key={campaign.id || index} campaign={campaign} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay campañas
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primera campaña de concientización.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nueva Campaña
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}