import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

interface RecommendationResult {
  product: typeof products[0];
  score: number;
  reasons: string[];
  aiExplanation: string;
}

const AIRecommendation = () => {
  const { currentUser } = useUserStore();
  const [userInput, setUserInput] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [userProfile, setUserProfile] = useState({
    budget: '',
    usage: '',
    experience: '',
    preferences: [] as string[]
  });
  const [step, setStep] = useState(1);

  const usageTypes = [
    { id: 'gaming', label: 'Gaming Competitivo', icon: '🎮', color: 'from-red-500 to-pink-500' },
    { id: 'work', label: 'Trabalho/Produtividade', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { id: 'content', label: 'Criação de Conteúdo', icon: '🎨', color: 'from-purple-500 to-indigo-500' },
    { id: 'streaming', label: 'Streaming/Lives', icon: '📺', color: 'from-green-500 to-emerald-500' },
    { id: 'casual', label: 'Uso Casual', icon: '🏠', color: 'from-yellow-500 to-orange-500' },
    { id: 'professional', label: 'Uso Profissional', icon: '🏢', color: 'from-gray-600 to-gray-700' }
  ];

  const budgetRanges = [
    { id: 'low', label: 'Até 50.000 MT', range: [0, 50000], icon: '💰' },
    { id: 'medium', label: '50.000 - 150.000 MT', range: [50000, 150000], icon: '💎' },
    { id: 'high', label: '150.000 - 300.000 MT', range: [150000, 300000], icon: '👑' },
    { id: 'premium', label: 'Acima de 300.000 MT', range: [300000, Infinity], icon: '🚀' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Iniciante', icon: '🌱', description: 'Primeiro contato com tecnologia' },
    { id: 'intermediate', label: 'Intermediário', icon: '⚡', description: 'Alguma experiência técnica' },
    { id: 'advanced', label: 'Avançado', icon: '🔥', description: 'Conhecimento técnico sólido' },
    { id: 'expert', label: 'Especialista', icon: '🎯', description: 'Expert em tecnologia' }
  ];

  const generateAIRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const requestData = {
        userProfile: {
          name: currentUser?.name || 'Cliente',
          gamePreferences: currentUser?.gamePreferences || userProfile.preferences,
          purchaseHistory: currentUser?.purchaseHistory || [],
          budget: userProfile.budget,
          usage: userProfile.usage,
          experience: userProfile.experience
        },
        query: userInput,
        maxRecommendations: 6
      };

      // Usar Gemini Service para recomendações
      const aiResponse = await geminiService.getPersonalizedRecommendations(requestData);
      
      setRecommendations(aiResponse.recommendations);
      setAiSummary(aiResponse.aiSummary);
      setPersonalizedMessage(aiResponse.personalizedMessage);
      
      toast.custom((_t) => (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🤖
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Gemini AI Ativada!</h3>
            <p className="text-sm opacity-90">
              {aiResponse.recommendations.length} recomendações personalizadas geradas
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });
      
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      toast.error('❌ Erro na IA. Usando recomendações locais.');
      
      // Fallback para recomendações locais
      generateLocalRecommendations();
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalRecommendations = () => {
    const selectedBudget = budgetRanges.find(b => b.id === userProfile.budget);
    const budgetRange = selectedBudget?.range || [0, Infinity];
    
    const scoredProducts = products
      .filter(product => product.price >= budgetRange[0] && product.price <= budgetRange[1])
      .map(product => {
        let score = 0;
        const reasons: string[] = [];
        
        // Lógica de pontuação local
        if (userProfile.usage === 'gaming') {
          if (product.category === 'consoles' || product.name.toLowerCase().includes('gaming')) {
            score += 40;
            reasons.push('Otimizado para gaming');
          }
        }
        
        score += product.rating * 5;
        if (product.inStock) {
          score += 10;
          reasons.push('Disponível em estoque');
        }
        
        return {
          product,
          score: Math.round(score),
          reasons: reasons.slice(0, 3),
          aiExplanation: 'Recomendado com base nas suas preferências e histórico.'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    setRecommendations(scoredProducts);
    setPersonalizedMessage(`Encontramos ${scoredProducts.length} produtos ideais para você!`);
  };

  const handleQuickRecommendation = async (query: string) => {
    setUserInput(query);
    setIsLoading(true);
    
    try {
      if (currentUser) {
        // Usar perfil do usuário logado
        const aiResponse = await geminiService.getPersonalizedRecommendations({
          userProfile: {
            name: currentUser.name,
            gamePreferences: currentUser.gamePreferences,
            purchaseHistory: currentUser.purchaseHistory,
            budget: currentUser.preferences.budget,
            usage: currentUser.preferences.usage,
            experience: currentUser.preferences.experience
          },
          query,
          maxRecommendations: 4
        });
        
        setRecommendations(aiResponse.recommendations);
        setAiSummary(aiResponse.aiSummary);
        setPersonalizedMessage(aiResponse.personalizedMessage);
      } else {
        // Recomendações básicas para usuários não logados
        const keywords = query.toLowerCase().split(' ');
        const quickResults = products
          .filter(product => {
            const searchText = `${product.name} ${product.description} ${product.category} ${product.specs.join(' ')}`.toLowerCase();
            return keywords.some(keyword => searchText.includes(keyword));
          })
          .map(product => ({
            product,
            score: Math.round(Math.random() * 40 + 60),
            reasons: ['Correspondência com busca', 'Produto popular', 'Boa avaliação'],
            aiExplanation: 'Recomendado com base na sua busca.'
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        
        setRecommendations(quickResults);
        setPersonalizedMessage(`Encontramos ${quickResults.length} produtos para "${query}"`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Erro ao buscar recomendações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🤖
            </motion.span>
            IA Recomendações Gemini
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            {currentUser ? 
              `Olá ${currentUser.name}! Nossa IA Gemini está pronta para recomendações personalizadas` :
              'Nossa IA avançada com Google Gemini analisa suas necessidades e encontra os produtos perfeitos'
            }
          </p>
        </motion.div>

        {/* User Status */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                  <p className="text-green-300">
                    🏆 {currentUser.loyaltyPoints} pontos • 
                    💰 {currentUser.totalSpent.toLocaleString('pt-MZ')} MT gastos •
                    🛍️ {currentUser.purchaseHistory.length} compras
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🚀 Recomendações Rápidas Gemini AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { query: 'gaming setup completo', icon: '🎮', label: 'Setup Gaming', color: 'from-red-500 to-pink-500' },
              { query: 'trabalho remoto produtividade', icon: '💼', label: 'Home Office', color: 'from-blue-500 to-cyan-500' },
              { query: 'streaming criação conteúdo', icon: '📺', label: 'Streaming', color: 'from-purple-500 to-indigo-500' },
              { query: 'celular fotografia', icon: '📱', label: 'Fotografia', color: 'from-green-500 to-emerald-500' }
            ].map((item, index) => (
              <motion.button
                key={item.query}
                onClick={() => handleQuickRecommendation(item.query)}
                className={`bg-gradient-to-r ${item.color} text-white p-4 rounded-xl hover:shadow-lg transition-all`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75 mt-1">Gemini AI</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Advanced AI Wizard */}
        {!currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <span>🧠</span> Assistente Gemini AI Avançado
            </h2>

            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {[1, 2, 3].map((stepNum) => (
                  <motion.div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      stepNum <= step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-600 text-gray-400'
                    }`}
                    animate={{ scale: stepNum === step ? 1.2 : 1 }}
                  >
                    {stepNum}
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">💰 Qual é o seu orçamento?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgetRanges.map((budget, index) => (
                      <motion.button
                        key={budget.id}
                        onClick={() => setUserProfile(prev => ({ ...prev, budget: budget.id }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          userProfile.budget === budget.id
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{budget.icon}</span>
                          <div>
                            <p className="font-medium">{budget.label}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
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
                  <h3 className="text-xl font-semibold text-white mb-4">🎯 Como você vai usar?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usageTypes.map((usage, index) => (
                      <motion.button
                        key={usage.id}
                        onClick={() => setUserProfile(prev => ({ ...prev, usage: usage.id }))}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          userProfile.usage === usage.id
                            ? `border-blue-500 bg-gradient-to-r ${usage.color} text-white`
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-3xl mb-2">{usage.icon}</div>
                        <p className="font-medium">{usage.label}</p>
                      </motion.button>
                    ))}
                  </div>
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
                  <h3 className="text-xl font-semibold text-white mb-4">🎓 Qual é o seu nível de experiência?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experienceLevels.map((level, index) => (
                      <motion.button
                        key={level.id}
                        onClick={() => setUserProfile(prev => ({ ...prev, experience: level.id }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          userProfile.experience === level.id
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{level.icon}</span>
                          <div>
                            <p className="font-medium">{level.label}</p>
                            <p className="text-sm opacity-75">{level.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Voltar
                </motion.button>
              )}
              
              <motion.button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    generateAIRecommendations();
                  }
                }}
                disabled={
                  (step === 1 && !userProfile.budget) ||
                  (step === 2 && !userProfile.usage) ||
                  (step === 3 && !userProfile.experience) ||
                  isLoading
                }
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step < 3 ? 'Próximo →' : isLoading ? 'IA Processando...' : '🤖 Gerar Recomendações Gemini'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Custom Query Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              💬 Pergunte à IA Gemini
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ex: Preciso de um setup para streaming em 4K..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateAIRecommendations()}
              />
              <motion.button
                onClick={generateAIRecommendations}
                disabled={isLoading || !userInput.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? '🤖 IA...' : '🚀 Perguntar'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-12"
            >
              <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  🤖
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Gemini AI Processando...</h3>
                <p className="text-blue-200">Analisando milhares de produtos com inteligência artificial Google</p>
                <div className="mt-4 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Summary */}
        {aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🧠</span> Análise da IA Gemini
              </h3>
              <div className="text-gray-200 leading-relaxed whitespace-pre-line">{aiSummary}</div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Results */}
        <AnimatePresence>
          {recommendations.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎯 Recomendações Personalizadas Gemini AI
                </h2>
                {personalizedMessage && (
                  <p className="text-xl text-blue-200">{personalizedMessage}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={rec.product.images[0]}
                        alt={rec.product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {rec.score}% Match
                      </div>
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🤖 Gemini
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{rec.product.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{rec.product.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2">🤖 Gemini recomenda porque:</h4>
                        <ul className="space-y-1">
                          {rec.reasons.map((reason, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4 p-3 bg-blue-900/30 rounded-lg">
                        <p className="text-xs text-blue-200">{rec.aiExplanation}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-400">
                          {rec.product.price.toLocaleString('pt-MZ')} MT
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < rec.product.rating ? 'text-yellow-400' : 'text-gray-600'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link
                        to={`/products/${rec.product.id}`}
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIRecommendation;