import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { currentUser, updateProfile, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<{ name?: string; phone?: string; address?: string }>(currentUser || { name: '', phone: '', address: '' });

  if (!currentUser) {
    return null;
  }

  const handleSave = () => {
    updateProfile(formData);
    setEditMode(false);
    toast.success('✅ Perfil atualizado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    toast.success('👋 Logout realizado com sucesso!');
    onClose();
  };

  const tabs = [
    { id: 'profile', label: '👤 Perfil', icon: '👤' },
    { id: 'purchases', label: '🛍️ Compras', icon: '🛍️' },
    { id: 'preferences', label: '⚙️ Preferências', icon: '⚙️' },
    { id: 'loyalty', label: '🏆 Fidelidade', icon: '🏆' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return '✅ Entregue';
      case 'shipped': return '🚚 Enviado';
      case 'confirmed': return '✔️ Confirmado';
      case 'pending': return '⏳ Pendente';
      case 'cancelled': return '❌ Cancelado';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{currentUser.name}</h2>
              <p className="text-gray-600">{currentUser.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  🏆 {currentUser.loyaltyPoints} pontos
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  💰 {currentUser.totalSpent.toLocaleString('pt-MZ')} MT gastos
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              🚪 Sair
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">👤 Informações Pessoais</h3>
                <button
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editMode ? '💾 Salvar' : '✏️ Editar'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{currentUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-800 font-medium">{currentUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{currentUser.phone || 'Não informado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cadastro</label>
                  <p className="text-gray-800 font-medium">
                    {new Date(currentUser.createdAt).toLocaleDateString('pt-MZ')}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  {editMode ? (
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{currentUser.address || 'Não informado'}</p>
                  )}
                </div>
              </div>

              {/* Game Preferences */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">🎮 Preferências de Jogos</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.gamePreferences.map((pref) => (
                    <span
                      key={pref}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'purchases' && (
            <motion.div
              key="purchases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800">🛍️ Histórico de Compras</h3>
              
              {currentUser.purchaseHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma compra ainda</h4>
                  <p className="text-gray-500">Explore nossos produtos e faça sua primeira compra!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentUser.purchaseHistory.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">
                            Pedido #{purchase.orderNumber}
                          </h4>
                          <p className="text-gray-600">
                            {new Date(purchase.date).toLocaleDateString('pt-MZ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
                            {getStatusLabel(purchase.status)}
                          </span>
                          <p className="font-bold text-lg text-green-600 mt-1">
                            {purchase.total.toLocaleString('pt-MZ')} MT
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {purchase.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity}x • {item.price.toLocaleString('pt-MZ')} MT
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {purchase.trackingNumber && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            📦 Código de rastreamento: <span className="font-mono font-bold">{purchase.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800">⚙️ Preferências</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">💰 Orçamento</h4>
                  <p className="text-gray-600">{currentUser.preferences.budget || 'Não definido'}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Uso Principal</h4>
                  <p className="text-gray-600">{currentUser.preferences.usage || 'Não definido'}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">🎓 Experiência</h4>
                  <p className="text-gray-600">{currentUser.preferences.experience || 'Não definido'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-800">📧 Notificações por Email</h4>
                    <p className="text-sm text-gray-600">Receber atualizações sobre pedidos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.notifications}
                      onChange={(e) => updateProfile({
                        preferences: { ...currentUser.preferences, notifications: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-800">📰 Newsletter</h4>
                    <p className="text-sm text-gray-600">Receber ofertas e novidades</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.newsletter}
                      onChange={(e) => updateProfile({
                        preferences: { ...currentUser.preferences, newsletter: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'loyalty' && (
            <motion.div
              key="loyalty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800">🏆 Programa de Fidelidade</h3>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-2xl font-bold">Seus Pontos</h4>
                    <p className="text-blue-100">Acumule pontos e ganhe recompensas</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{currentUser.loyaltyPoints}</div>
                    <div className="text-blue-100">pontos</div>
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Próxima recompensa</span>
                    <span>{Math.max(0, 1000 - (currentUser.loyaltyPoints % 1000))} pontos restantes</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentUser.loyaltyPoints % 1000) / 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">🎁 Como Ganhar Pontos</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 1 ponto para cada 1.000 MT gastos</li>
                    <li>• 100 pontos de boas-vindas</li>
                    <li>• 50 pontos por avaliação de produto</li>
                    <li>• 200 pontos por indicação de amigo</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4">🏆 Recompensas</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 500 pontos = 5% desconto</li>
                    <li>• 1000 pontos = 10% desconto</li>
                    <li>• 2000 pontos = Frete grátis</li>
                    <li>• 5000 pontos = Produto exclusivo</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Dica</h4>
                <p className="text-yellow-700 text-sm">
                  Ative as notificações para receber alertas sobre promoções especiais e oportunidades de ganhar pontos extras!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
