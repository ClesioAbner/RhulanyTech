import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, -50]);
  
  // Spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) / rect.width;
        const mouseY = (e.clientY - centerY) / rect.height;
        
        setMousePosition({ x: mouseX, y: mouseY });
        x.set(mouseX * 20);
        y.set(mouseY * 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  const heroSlides = [
    {
      title: "Gaming de Nova Geração",
      subtitle: "RTX 4090 • PlayStation 5 Pro • Xbox Series X",
      description: "Experimente o futuro dos games com hardware de última geração",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&h=1080&q=90",
      cta: "Explorar Gaming",
      link: "/products?category=consoles",
      gradient: "from-purple-600 via-blue-600 to-cyan-500"
    },
    {
      title: "Smartphones Premium",
      subtitle: "iPhone 15 Pro • Galaxy S24 Ultra • Pixel 8 Pro",
      description: "Tecnologia móvel que redefine possibilidades",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1920&h=1080&q=90",
      cta: "Ver Celulares",
      link: "/products?category=celulares",
      gradient: "from-blue-600 via-purple-600 to-pink-500"
    },
    {
      title: "Workstations Profissionais",
      subtitle: "MacBook Pro M3 • Dell XPS • Alienware",
      description: "Poder computacional para criadores e profissionais",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1920&h=1080&q=90",
      cta: "Computadores Pro",
      link: "/products?category=computadores",
      gradient: "from-indigo-600 via-purple-600 to-blue-500"
    },
    {
      title: "Periféricos Gaming Elite",
      subtitle: "Razer • Logitech • SteelSeries • Corsair",
      description: "Equipamentos profissionais para performance máxima",
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1920&h=1080&q=90",
      cta: "Ver Periféricos",
      link: "/products?category=perifericos",
      gradient: "from-green-600 via-emerald-600 to-cyan-500"
    },
    {
      title: "Componentes de Alta Performance",
      subtitle: "RTX 4090 • Intel i9 • AMD Ryzen • DDR5",
      description: "Componentes premium para builds extremos",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1920&h=1080&q=90",
      cta: "Ver Componentes",
      link: "/products?category=componentes",
      gradient: "from-red-600 via-orange-600 to-yellow-500"
    }
  ];

  const categories = [
    {
      title: 'Gaming Extremo',
      description: 'PCs, consoles e periféricos para a melhor experiência gaming',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-red-500 via-pink-500 to-purple-600',
      link: '/products?category=consoles',
      stats: '60+ Produtos'
    },
    {
      title: 'Smartphones Premium',
      description: 'Os mais avançados celulares com tecnologia de ponta',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      link: '/products?category=celulares',
      stats: '25+ Modelos'
    },
    {
      title: 'Workstations Pro',
      description: 'Computadores profissionais para criação e produtividade',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-purple-500 via-indigo-500 to-blue-600',
      link: '/products?category=computadores',
      stats: '15+ Configurações'
    },
    {
      title: 'Periféricos Gaming',
      description: 'Teclados, mouses, headsets e monitores de alta performance',
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-green-500 via-emerald-500 to-cyan-500',
      link: '/products?category=perifericos',
      stats: '40+ Acessórios'
    },
    {
      title: 'Componentes PC',
      description: 'Placas de vídeo, processadores e componentes premium',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      link: '/products?category=componentes',
      stats: '30+ Componentes'
    },
    {
      title: 'Academia Gamer',
      description: 'Aprenda estratégias, técnicas e se torne um pro player',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&w=800&q=85',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      link: '/academy',
      stats: 'Novidade!'
    }
  ];

  const features = [
    {
      title: 'Garantia Premium',
      description: 'Produtos originais com garantia estendida e suporte técnico especializado',
      gradient: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Entrega Expressa',
      description: 'Entrega rápida em todo Moçambique com rastreamento em tempo real',
      gradient: 'from-green-500 to-emerald-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Pagamento Flexível',
      description: 'M-Pesa, E-mola, cartões e criptomoedas. Parcelamento disponível',
      gradient: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'IA Personalizada',
      description: 'Recomendações inteligentes baseadas no seu perfil e preferências',
      gradient: 'from-orange-500 to-red-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Programa Fidelidade',
      description: 'Acumule pontos, ganhe descontos e tenha acesso a ofertas exclusivas',
      gradient: 'from-yellow-500 to-orange-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      title: 'Academia Gamer',
      description: 'Aprenda com os melhores, melhore suas skills e se torne profissional',
      gradient: 'from-indigo-500 to-purple-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Manjate',
      role: 'Pro Gamer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150',
      text: 'A Rhulany Tech transformou meu setup! Agora jogo em outro nível com equipamentos de qualidade mundial.',
      game: 'CS2 Global Elite'
    },
    {
      name: 'Ana Sitoe',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150',
      text: 'Equipamentos profissionais que elevaram a qualidade dos meus vídeos. Atendimento excepcional!',
      game: '500K Subscribers'
    },
    {
      name: 'João Macamo',
      role: 'Desenvolvedor',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150',
      text: 'MacBook Pro M3 da Rhulany Tech acelerou meu workflow. Recomendo para todos os profissionais!',
      game: 'Senior Developer'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Clientes Satisfeitos' },
    { number: '500+', label: 'Produtos Premium' },
    { number: '99.9%', label: 'Uptime Garantido' },
    { number: '24/7', label: 'Suporte Técnico' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero Section with 3D Effects */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background Slides */}
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <motion.img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{
                transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0) scale(1.1)`
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-30 mix-blend-multiply`} />
          </motion.div>
        ))}

        {/* 3D Floating Elements */}
        <motion.div
          className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20"
          style={{ x, y }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-20"
          style={{ 
            x: useTransform(x, [0, 1], [0, -50]),
            y: useTransform(y, [0, 1], [0, -30])
          }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Hero Content with 3D Transform */}
        <motion.div 
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left"
          style={{ 
            y: y1,
            rotateX: useTransform(y, [-0.5, 0.5], [5, -5]),
            rotateY: useTransform(x, [-0.5, 0.5], [-5, 5]),
          }}
        >
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8 max-w-4xl"
          >
            {/* Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center space-x-4 mb-8"
            >
              <Logo size="lg" animated />
              <div>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Rhulany Tech
                </motion.h1>
                <p className="text-blue-200 font-medium">Premium Gaming Store</p>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {heroSlides[currentSlide].title}
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-4"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            <motion.p 
              className="text-lg text-gray-300 mb-8 max-w-2xl"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {heroSlides[currentSlide].description}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={heroSlides[currentSlide].link}
                  className={`group relative inline-flex items-center px-8 py-4 bg-gradient-to-r ${heroSlides[currentSlide].gradient} text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden`}
                >
                  <span className="relative z-10 flex items-center">
                    {heroSlides[currentSlide].cta}
                    <motion.svg 
                      className="ml-2 w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/ai-recommendation"
                  className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  IA Recomendações
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
          {heroSlides.map((slide, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative w-12 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {currentSlide === index && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} rounded-full`}
                  layoutId="activeSlide"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 right-8 text-white/70 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Scroll</span>
            <motion.div 
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden"
              whileHover={{ borderColor: "rgba(255,255,255,0.6)" }}
            >
              <motion.div 
                className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with 3D Cards */}
      <motion.section 
        className="py-24 relative"
        style={{ y: y2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Números que Impressionam
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Resultados que comprovam nossa excelência e confiança dos clientes
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10,
                  z: 50
                }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center transform-gpu">
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                    whileInView={{ 
                      scale: [0, 1.1, 1],
                      filter: ["hue-rotate(0deg)", "hue-rotate(360deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-gray-300 font-medium">{stat.label}</p>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                    whileHover={{ scale: 1.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section with Enhanced 3D Effects */}
      <section className="py-24 relative">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ y: y3 }}
        >
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Categorias Premium
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore nossa seleção curada de produtos de tecnologia de ponta
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 50, rotateX: 30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 100
                }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <Link to={category.link} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating particles effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    >
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white/30 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [-20, -60],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <motion.h3 
                        className="text-2xl font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        {category.title}
                      </motion.h3>
                      <motion.span 
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                      >
                        {category.stats}
                      </motion.span>
                    </div>
                    <p className="text-gray-200 mb-4">{category.description}</p>
                    
                    <motion.div 
                      className="flex items-center text-white/80 group-hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium">Explorar</span>
                      <motion.svg 
                        className="ml-2 w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl -z-10 blur-xl"
                    whileHover={{ scale: 1.1 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section with Glass Morphism */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Por que Escolher a Rhulany Tech?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Benefícios exclusivos que fazem a diferença na sua experiência
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50
                }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl h-full transform-gpu">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 360,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl -z-10 blur-xl`}
                    whileHover={{ scale: 1.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              O que Dizem Nossos Clientes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Histórias reais de sucesso com nossos produtos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50
                }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl h-full transform-gpu">
                  <div className="flex items-center mb-6">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    />
                    <div>
                      <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                      <p className="text-gray-300">{testimonial.role}</p>
                      <p className="text-sm text-blue-400">{testimonial.game}</p>
                    </div>
                  </div>
                  
                  <motion.p 
                    className="text-gray-300 leading-relaxed mb-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    "{testimonial.text}"
                  </motion.p>
                  
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10 blur-xl"
                    whileHover={{ scale: 1.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
              whileHover={{ scale: 1.05 }}
            >
              Pronto para Elevar seu Game?
            </motion.h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de gamers e profissionais que já escolheram a excelência da Rhulany Tech
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/products"
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Ver Produtos
                    <motion.svg 
                      className="ml-2 w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/academy"
                  className="group inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academia Gamer
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;