import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../stores/userStore';
import { geminiService } from '../services/geminiService';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: any[];
  suggestions?: string[];
  isTyping?: boolean;
}

const ChatBot = () => {
  const { currentUser } = useUserStore();
  const { addToCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `🤖 Olá! Sou a Rhulany AI, sua assistente virtual especializada em tecnologia. Como posso ajudar você hoje?`,
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        '📱 Mostrar celulares em promoção',
        '💻 Computadores para gaming',
        '🎮 Consoles disponíveis',
        '🔧 Componentes de PC',
        '💡 Recomendações personalizadas'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const detectIntent = (message: string): { category: string; products?: any[] } => {
    const lowerMessage = message.toLowerCase();
    
    // Detectar categoria de produtos
    if (lowerMessage.includes('celular') || lowerMessage.includes('smartphone') || lowerMessage.includes('iphone') || lowerMessage.includes('samsung')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.category === 'celulares').slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('computador') || lowerMessage.includes('laptop') || lowerMessage.includes('pc') || lowerMessage.includes('macbook')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.category === 'computadores').slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('console') || lowerMessage.includes('playstation') || lowerMessage.includes('xbox') || lowerMessage.includes('nintendo')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.category === 'consoles').slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('periférico') || lowerMessage.includes('mouse') || lowerMessage.includes('teclado') || lowerMessage.includes('headset')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.category === 'perifericos').slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('componente') || lowerMessage.includes('placa') || lowerMessage.includes('processador') || lowerMessage.includes('memória')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.category === 'componentes').slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('promoção') || lowerMessage.includes('desconto') || lowerMessage.includes('oferta')) {
      return { 
        category: 'product_search', 
        products: products.filter(p => p.discount && p.discount > 0).slice(0, 4)
      };
    }
    
    if (lowerMessage.includes('recomend') || lowerMessage.includes('suger') || lowerMessage.includes('melhor')) {
      return { 
        category: 'recommendation', 
        products: products.slice(0, 4)
      };
    }
    
    return { category: 'general' };
  };

  const generateSuggestions = (category: string): string[] => {
    switch (category) {
      case 'product_search':
        return [
          '💰 Ver preços e promoções',
          '📊 Comparar produtos',
          '🛒 Adicionar ao carrinho',
          '📱 Ver mais detalhes'
        ];
      case 'recommendation':
        return [
          '🎮 Para gaming',
          '💼 Para trabalho',
          '🎨 Para criação',
          '📚 Para estudos'
        ];
      default:
        return [
          '📱 Ver celulares',
          '💻 Ver computadores',
          '🎮 Ver consoles',
          '🔧 Ver componentes'
        ];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage(suggestion);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    
    toast.custom((_t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          🛒
        </motion.div>
        <div>
          <h3 className="font-bold">Adicionado!</h3>
          <p className="text-sm opacity-90">{product.name}</p>
        </div>
      </motion.div>
    ), { duration: 3000 });
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Detectar intenção e produtos relevantes
    const { category, products: relevantProducts } = detectIntent(text);

    try {
      // Usar Gemini AI para resposta universal
      const aiResponse = await geminiService.getUniversalResponse(text, {
        userContext: currentUser,
        category,
        availableProducts: relevantProducts || products.slice(0, 10)
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts,
        suggestions: generateSuggestions(category)
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '🤖 Desculpe, tive um problema técnico. Mas posso ajudar você a encontrar produtos incríveis! Que tipo de produto você está procurando?',
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts,
        suggestions: [
          '📱 Celulares em destaque',
          '💻 Computadores gaming',
          '🎮 Consoles populares',
          '🔧 Componentes PC'
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Compacto */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isOpen ? 180 : 0,
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { duration: 0.3 },
          scale: { duration: 2, repeat: Infinity }
        }}
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <motion.span 
            className="text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🤖
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window - Compacto */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-20 right-4 z-40 w-[calc(100vw-2rem)] sm:w-80 max-w-sm h-[50vh] sm:h-[400px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
          >
            {/* Header - Compacto */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-sm">🤖</span>
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Rhulany AI</h3>
                  <p className="text-blue-100 text-xs">Assistente Virtual</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg">✕</span>
                </motion.button>
              </div>
            </div>

            {/* Messages - Compacto */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 h-[calc(50vh-120px)] sm:h-[280px]">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                      {!message.isUser && (
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs">🤖</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString('pt-MZ', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`p-2 rounded-xl text-sm ${
                          message.isUser
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-gray-800 text-gray-100 border border-gray-700'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-xs leading-relaxed">
                          {message.text}
                        </div>
                      </div>

                      {/* Products Grid - Compacto */}
                      {message.products && message.products.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 grid grid-cols-1 gap-2"
                        >
                          {message.products.slice(0, 2).map((product) => (
                            <motion.div
                              key={product.id}
                              className="bg-gray-800 rounded-lg p-2 border border-gray-700 hover:border-blue-500 transition-all"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="relative mb-1">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-12 object-cover rounded"
                                />
                                {product.discount && (
                                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded">
                                    -{product.discount}%
                                  </div>
                                )}
                              </div>
                              
                              <h4 className="text-white font-medium text-xs mb-1 line-clamp-1">
                                {product.name}
                              </h4>
                              
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-green-400 font-bold text-xs">
                                  {product.price.toLocaleString('pt-MZ')} MT
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-400 text-xs">⭐</span>
                                  <span className="text-gray-400 text-xs">{product.rating}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-1 rounded transition-colors"
                                >
                                  🛒
                                </button>
                                <Link
                                  to={`/products/${product.id}`}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-1 rounded transition-colors text-center"
                                >
                                  👁️
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Suggestions - Compacto */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex flex-wrap gap-1"
                        >
                          {message.suggestions.slice(0, 3).map((suggestion, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded-full transition-colors border border-gray-600 hover:border-gray-500"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}

                      {message.isUser && (
                        <div className="text-xs text-gray-400 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString('pt-MZ', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Animation - Compacto */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-300 text-xs">Pensando...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input - Compacto */}
            <div className="p-3 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">🚀</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;