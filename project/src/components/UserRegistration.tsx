import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

interface UserRegistrationProps {
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onClose, onSuccess }) => {
  const { register, checkEmailExists, login } = useUserStore();
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    avatar: '',
    gamePreferences: [] as string[],
    registrationMethod: 'email' as const,
    preferences: {
      budget: '',
      usage: '',
      experience: '',
      notifications: true,
      newsletter: true
    }
  });
  const [uploading, setUploading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gameCategories = [
    { id: 'fps', name: 'FPS (Counter-Strike, Valorant)', icon: '🎯', color: 'from-red-500 to-orange-500' },
    { id: 'moba', name: 'MOBA (League of Legends, Dota)', icon: '⚔️', color: 'from-blue-500 to-purple-500' },
    { id: 'rpg', name: 'RPG (Cyberpunk, Witcher)', icon: '🗡️', color: 'from-green-500 to-emerald-500' },
    { id: 'racing', name: 'Racing (Forza, Gran Turismo)', icon: '🏎️', color: 'from-yellow-500 to-red-500' },
    { id: 'strategy', name: 'Strategy (Age of Empires)', icon: '🏰', color: 'from-purple-500 to-pink-500' },
    { id: 'simulation', name: 'Simulation (Flight Sim)', icon: '✈️', color: 'from-cyan-500 to-blue-500' },
    { id: 'sports', name: 'Sports (FIFA, NBA 2K)', icon: '⚽', color: 'from-green-500 to-blue-500' },
    { id: 'adventure', name: 'Adventure (Assassin\'s Creed)', icon: '🗺️', color: 'from-indigo-500 to-purple-500' }
  ];

  const budgetRanges = [
    { id: 'low', label: 'Até 50.000 MT', icon: '💰' },
    { id: 'medium', label: '50.000 - 150.000 MT', icon: '💎' },
    { id: 'high', label: '150.000 - 300.000 MT', icon: '👑' },
    { id: 'premium', label: 'Acima de 300.000 MT', icon: '🚀' }
  ];

  const usageTypes = [
    { id: 'gaming', label: 'Gaming Competitivo', icon: '🎮' },
    { id: 'work', label: 'Trabalho/Produtividade', icon: '💼' },
    { id: 'content', label: 'Criação de Conteúdo', icon: '🎨' },
    { id: 'streaming', label: 'Streaming/Lives', icon: '📺' },
    { id: 'casual', label: 'Uso Casual', icon: '🏠' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Iniciante', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediário', icon: '⚡' },
    { id: 'advanced', label: 'Avançado', icon: '🔥' },
    { id: 'expert', label: 'Especialista', icon: '🎯' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('❌ Arquivo muito grande. Máximo 5MB.');
        return;
      }

      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
        setUploading(false);
        toast.success('📸 Avatar carregado com sucesso!');
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error('❌ Erro ao carregar imagem.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLogin = async (method: 'google' | 'steam' | 'discord') => {
    try {
      // Simular login social
      const mockUser = await register({
        name: `Usuário ${method.charAt(0).toUpperCase() + method.slice(1)}`,
        email: `user@${method}.com`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
        registrationMethod: method,
        gamePreferences: [],
        preferences: {
          budget: 'medium',
          usage: 'gaming',
          experience: 'intermediate',
          notifications: true,
          newsletter: true
        }
      });

      toast.success(`✅ Login com ${method} realizado com sucesso!`);
      onSuccess?.(mockUser);
      onClose();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { getUserByEmail } = useUserStore.getState();
      const user = getUserByEmail(loginData.email);
      
      if (!user) {
        toast.error('❌ Email não encontrado');
        return;
      }

      login(user);
      toast.success(`🎉 Bem-vindo de volta, ${user.name}!`);
      onSuccess?.(user);
      onClose();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validações do primeiro step
      if (!formData.name.trim()) {
        toast.error('❌ Nome é obrigatório');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('❌ Email é obrigatório');
        return;
      }
      if (checkEmailExists(formData.email)) {
        toast.error('❌ Este email já está cadastrado');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('❌ Senha deve ter pelo menos 6 caracteres');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('❌ Senhas não coincidem');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.avatar) {
        toast.error('❌ Selecione um avatar');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.preferences.budget || !formData.preferences.usage || !formData.preferences.experience) {
        toast.error('❌ Complete todas as preferências');
        return;
      }
      setStep(4);
    } else {
      try {
        const newUser = await register(formData);
        toast.success(`🎉 Bem-vindo à Rhulany Tech, ${newUser.name}!`);
        onSuccess?.(newUser);
        onClose();
      } catch (error: any) {
        toast.error(`❌ ${error.message}`);
      }
    }
  };

  const toggleGamePreference = (gameId: string) => {
    setFormData(prev => ({
      ...prev,
      gamePreferences: prev.gamePreferences.includes(gameId)
        ? prev.gamePreferences.filter(id => id !== gameId)
        : [...prev.gamePreferences, gameId]
    }));
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
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            {isLogin ? '🔐 Entrar' : 
             step === 1 ? '🎮 Criar Conta' : 
             step === 2 ? '👤 Escolher Avatar' : 
             step === 3 ? '⚙️ Preferências' :
             '🎯 Jogos Favoritos'}
          </motion.h2>
          
          {!isLogin && (
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <motion.div
                  key={stepNum}
                  className={`h-2 rounded-full transition-all ${
                    stepNum <= step ? 'bg-gradient-to-r from-cyan-400 to-purple-400 w-12' : 'bg-gray-600 w-8'
                  }`}
                  initial={{ width: 32 }}
                  animate={{ width: stepNum <= step ? 48 : 32 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Toggle Login/Register */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-l-xl transition-all ${
              !isLogin ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Cadastrar
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-r-xl transition-all ${
              isLogin ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Entrar
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="📧 Email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="🔒 Senha"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
            >
              🚀 Entrar
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Social Login Options */}
                  <div className="space-y-3 mb-6">
                    {[
                      { method: 'google', color: 'from-red-500 to-red-600', icon: '🔍', label: 'Google' },
                      { method: 'steam', color: 'from-blue-600 to-blue-700', icon: '🎮', label: 'Steam' },
                      { method: 'discord', color: 'from-indigo-600 to-indigo-700', icon: '💬', label: 'Discord' }
                    ].map((social, index) => (
                      <motion.button
                        key={social.method}
                        type="button"
                        onClick={() => handleSocialLogin(social.method as any)}
                        className={`w-full bg-gradient-to-r ${social.color} text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span>{social.icon}</span> Continuar com {social.label}
                      </motion.button>
                    ))}
                  </div>

                  <div className="text-center text-gray-400 mb-4">
                    <span>ou cadastre-se com email</span>
                  </div>

                  {[
                    { name: 'name', type: 'text', placeholder: '👤 Nome completo', icon: '👤' },
                    { name: 'email', type: 'email', placeholder: '📧 Email', icon: '📧' },
                    { name: 'phone', type: 'tel', placeholder: '📱 Telefone (opcional)', icon: '📱' },
                    { name: 'password', type: 'password', placeholder: '🔒 Senha', icon: '🔒' },
                    { name: 'confirmPassword', type: 'password', placeholder: '🔒 Confirmar senha', icon: '🔒' }
                  ].map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData] as string}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                        required={field.name !== 'phone'}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-gray-300 text-center mb-4">Escolha seu avatar:</p>
                  
                  {/* Upload Custom Avatar */}
                  <div className="text-center">
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <span>📸</span> Carregar do Dispositivo
                        </>
                      )}
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-400 mt-2">Máximo 5MB • JPG, PNG, GIF</p>
                  </div>

                  {/* Current Avatar Preview */}
                  {formData.avatar && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
                        <img
                          src={formData.avatar}
                          alt="Avatar selecionado"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-green-400 mt-2 text-sm">✅ Avatar selecionado</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <p className="text-gray-300 text-center mb-4">Configure suas preferências:</p>
                  
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">💰 Orçamento</label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetRanges.map((budget) => (
                        <button
                          key={budget.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, budget: budget.id }
                          }))}
                          className={`p-3 rounded-xl border-2 transition-all text-sm ${
                            formData.preferences.budget === budget.id
                              ? 'border-cyan-400 bg-cyan-400/20 text-white'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-lg mb-1">{budget.icon}</div>
                          <div className="font-medium">{budget.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">🎯 Uso Principal</label>
                    <div className="space-y-2">
                      {usageTypes.map((usage) => (
                        <button
                          key={usage.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, usage: usage.id }
                          }))}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                            formData.preferences.usage === usage.id
                              ? 'border-cyan-400 bg-cyan-400/20 text-white'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{usage.icon}</span>
                            <span className="font-medium">{usage.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">🎓 Experiência</label>
                    <div className="grid grid-cols-2 gap-2">
                      {experienceLevels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            preferences: { ...prev.preferences, experience: level.id }
                          }))}
                          className={`p-3 rounded-xl border-2 transition-all text-sm ${
                            formData.preferences.experience === level.id
                              ? 'border-cyan-400 bg-cyan-400/20 text-white'
                              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-lg mb-1">{level.icon}</div>
                          <div className="font-medium">{level.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-300 text-center mb-4">
                    Selecione seus jogos favoritos para recomendações personalizadas:
                  </p>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {gameCategories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        type="button"
                        onClick={() => toggleGamePreference(category.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.gamePreferences.includes(category.id)
                            ? `border-cyan-400 bg-gradient-to-r ${category.color} text-white shadow-lg`
                            : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          {formData.gamePreferences.includes(category.id) && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto text-xl"
                            >
                              ✓
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <motion.p 
                    className="text-sm text-gray-400 text-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Selecionados: {formData.gamePreferences.length} categorias
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-6">
              {step > 1 && !isLogin && (
                <motion.button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Voltar
                </motion.button>
              )}
              <motion.button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {step === 4 ? '🎉 Finalizar Cadastro' : 'Próximo →'}
              </motion.button>
            </div>
          </form>
        )}

        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default UserRegistration;