import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from './stores/userStore';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import About from './components/About';
import Academy from './pages/Academy';
import AIRecommendation from './components/AIRecommendation';
import ChatBot from './components/ChatBot';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';
import UserRegistration from './components/UserRegistration';
import UserProfile from './components/UserProfile';
import Blog from './pages/Blog';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';

function App() {
  const { currentUser, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navigationItems = [
    {
      path: '/products',
      label: 'Produtos',
      icon: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=32&h=32',
      description: 'Gaming & Tech'
    },
    {
      path: '/academy',
      label: 'Academia',
      icon: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=32&h=32',
      description: 'Aprenda Gaming'
    },
    {
      path: '/blog',
      label: 'Blog',
      icon: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=32&h=32',
      description: 'Notícias Tech'
    },
    {
      path: '/ai-recommendation',
      label: 'IA Gemini',
      icon: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=32&h=32',
      description: 'Recomendações'
    },
    {
      path: '/about',
      label: 'Sobre',
      icon: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=32&h=32',
      description: 'Nossa História'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Premium com Tamanho Médio */}
      <motion.header 
        className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section com Animação */}
            <motion.div 
              className="flex items-center relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/" className="flex items-center space-x-3 group relative">
                {/* Glow effect atrás do logo */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Logo size="md" variant="default" animated={true} />
              </Link>
            </motion.div>

            {/* Desktop Navigation com Imagens */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link 
                    to={item.path}
                    className="relative group px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Imagem do Item */}
                      <motion.div 
                        className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay com gradiente no hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ opacity: 1 }}
                        />
                      </motion.div>
                      
                      {/* Texto do Menu */}
                      <div className="flex flex-col">
                        <motion.span 
                          className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                          whileHover={{ x: 2 }}
                        >
                          {item.label}
                        </motion.span>
                        <motion.span 
                          className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                          initial={{ opacity: 0, y: 5 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          {item.description}
                        </motion.span>
                      </div>
                    </div>
                    
                    {/* Efeito de fundo animado */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      whileHover={{ scale: 1.05 }}
                    />
                    
                    {/* Indicador de hover */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                      style={{ transform: 'translateX(-50%)' }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Section com Animações */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon Animado */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                    </svg>
                  </motion.div>
                  
                  {/* Badge animado */}
                  <motion.div
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    0
                  </motion.div>
                </Link>
              </motion.div>

              {/* User Section */}
              {currentUser ? (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-500 group-hover:border-purple-500 transition-colors duration-300 shadow-md"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="hidden md:block font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 text-sm">
                      {currentUser.name}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-all duration-300 p-2 rounded-xl hover:bg-red-50 group"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => setShowRegistration(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium relative overflow-hidden group text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      👤
                    </motion.span>
                    <span>Entrar</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.svg 
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </motion.svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Animado */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="py-4 space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 font-medium group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <motion.div 
                          className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <img
                            src={item.icon}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {currentUser ? (
                    <>
                      <motion.button
                        onClick={() => {
                          setShowProfile(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all duration-300 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <img
                          src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32'}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <span>Meu Perfil</span>
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span>Sair</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={() => {
                        setShowRegistration(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span>👤</span>
                      </div>
                      <span>Entrar / Cadastrar</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<Blog />} />
          <Route path="/ai-recommendation" element={<AIRecommendation />} />
        </Routes>
      </main>

      {/* Modals */}
      {showRegistration && (
        <UserRegistration
          onClose={() => setShowRegistration(false)}
          onSuccess={() => setShowRegistration(false)}
        />
      )}

      {showProfile && currentUser && (
        <UserProfile
          onClose={() => setShowProfile(false)}
        />
      )}

      <ChatBot />
      <SocialLinks />
      <Footer />
    </div>
  );
}

export default App;