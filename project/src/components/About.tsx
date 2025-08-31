import { motion } from 'framer-motion';

const About = () => {
  const team = [
    {
      name: 'Eclesio Pembelane',
      role: 'Desenvolvedor Full Stack & Arquiteto de Sistemas',
      description: 'Especialista em React, Node.js, Python e arquitetura de microsserviços. Responsável pela infraestrutura e integração de APIs.',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker']
    },
    {
      name: 'Edilson Malache',
      role: 'Especialista em IA & Backend Engineer',
      description: 'Expert em Machine Learning, processamento de linguagem natural e desenvolvimento de sistemas de recomendação inteligentes.',
      skills: ['Python', 'TensorFlow', 'NLP', 'FastAPI', 'PostgreSQL']
    },
    {
      name: 'Nelson Mombi',
      role: 'Desenvolvedor Frontend & UX Designer',
      description: 'Focado em experiência do usuário, interfaces responsivas e otimização de performance frontend.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Framer Motion']
    },
    {
      name: 'Meyvin da Silva',
      role: 'Arquiteto de Software & DevOps Engineer',
      description: 'Responsável pela arquitetura do sistema, CI/CD, segurança e escalabilidade da plataforma.',
      skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Security', 'Microservices']
    }
  ];

  const systemFeatures = [
    {
      icon: '🤖',
      title: 'Inteligência Artificial Avançada',
      description: 'Sistema de recomendação personalizado que aprende com o comportamento do usuário para sugerir produtos ideais.'
    },
    {
      icon: '🔒',
      title: 'Segurança Bancária',
      description: 'Criptografia end-to-end, tokenização de dados sensíveis e conformidade com padrões internacionais de segurança.'
    },
    {
      icon: '📱',
      title: 'Experiência Mobile-First',
      description: 'Interface otimizada para dispositivos móveis, garantindo uma experiência fluida em qualquer tela.'
    },
    {
      icon: '⚡',
      title: 'Performance Otimizada',
      description: 'Carregamento ultra-rápido com lazy loading, cache inteligente e otimização de imagens automática.'
    },
    {
      icon: '🌍',
      title: 'Localização Moçambicana',
      description: 'Adaptado especificamente para o mercado moçambicano com suporte a M-Pesa, E-mola e métodos locais.'
    },
    {
      icon: '📊',
      title: 'Analytics em Tempo Real',
      description: 'Dashboard avançado com métricas de vendas, comportamento do usuário e insights de negócio.'
    },
    {
      icon: '🔄',
      title: 'Visualização 360° do Produto',
      description: 'Permite girar o produto em todos os ângulos, com zoom e detalhes em HD para uma experiência imersiva.'
    },
    {
      icon: '👤',
      title: 'Cadastro Completo e Rápido',
      description: 'Cadastro via e-mail, Google, Steam ou Discord com perfil personalizado e preferências de jogo.'
    },
    {
      icon: '💳',
      title: 'API de Pagamento Otimizada',
      description: 'Integração com PayPal, M-Pesa, cartões bancários e criptomoedas com tokenização segura.'
    },
    {
      icon: '📩',
      title: 'Envio de E-mails em Tempo Real',
      description: 'Sistema automatizado de confirmação de pedidos, envio, entrega e promoções personalizadas.'
    },
    {
      icon: '🎮',
      title: 'Integração Gaming',
      description: 'Conectividade com Steam, Discord e plataformas de streaming para uma experiência gaming completa.'
    },
    {
      icon: '📈',
      title: 'Dashboard Administrativo',
      description: 'Painel completo com análises de vendas, tendências por categoria e filtros avançados.'
    }
  ];

  const technologies = [
    { name: 'React 18', category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', category: 'Frontend', color: 'from-blue-600 to-blue-700' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'from-teal-500 to-green-500' },
    { name: 'Framer Motion', category: 'Animation', color: 'from-purple-500 to-pink-500' },
    { name: 'Node.js', category: 'Backend', color: 'from-green-600 to-green-700' },
    { name: 'Python', category: 'AI/ML', color: 'from-yellow-500 to-orange-500' },
    { name: 'PostgreSQL', category: 'Database', color: 'from-blue-700 to-indigo-700' },
    { name: 'Redis', category: 'Cache', color: 'from-red-500 to-red-600' },
    { name: 'Docker', category: 'DevOps', color: 'from-blue-500 to-blue-600' },
    { name: 'AWS', category: 'Cloud', color: 'from-orange-500 to-yellow-500' },
    { name: 'TensorFlow', category: 'AI/ML', color: 'from-orange-600 to-red-600' },
    { name: 'FastAPI', category: 'Backend', color: 'from-green-500 to-teal-500' },
    { name: 'Zustand', category: 'State Management', color: 'from-purple-600 to-indigo-600' },
    { name: 'Vite', category: 'Build Tool', color: 'from-yellow-400 to-orange-400' },
    { name: 'Stripe API', category: 'Payments', color: 'from-indigo-500 to-purple-500' },
    { name: 'SendGrid', category: 'Email', color: 'from-blue-400 to-blue-500' }
  ];

  const platformStats = [
    { label: 'Produtos Disponíveis', value: '60+', icon: '🛍️' },
    { label: 'Categorias', value: '6', icon: '📂' },
    { label: 'Métodos de Pagamento', value: '7', icon: '💳' },
    { label: 'Uptime', value: '99.9%', icon: '⚡' },
    { label: 'Tempo de Resposta', value: '<200ms', icon: '🚀' },
    { label: 'Segurança SSL', value: '256-bit', icon: '🔒' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Sobre a Rhulany Tech
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Uma plataforma de e-commerce revolucionária, desenvolvida por moçambicanos para revolucionar 
            o comércio eletrônico em Moçambique com tecnologia de ponta e inteligência artificial.
          </p>
        </motion.div>

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            📊 Estatísticas da Plataforma
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-blue-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🚀 Sistema de E-commerce de Nova Geração
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Nossa Missão</h3>
                <p className="text-gray-300 leading-relaxed">
                  Democratizar o acesso à tecnologia em Moçambique através de uma plataforma 
                  inteligente que conecta consumidores aos melhores produtos tecnológicos, 
                  com recomendações personalizadas e experiência de compra excepcional.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Nossa Visão</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ser a principal referência em e-commerce tecnológico na África Austral, 
                  impulsionando a transformação digital e contribuindo para o desenvolvimento 
                  econômico sustentável da região.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            🔧 Funcionalidades Inovadoras da Plataforma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            👥 Equipe de Desenvolvimento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-300 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{member.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
                          whileHover={{ scale: 1.1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            ⚙️ Stack Tecnológico
          </h2>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`bg-gradient-to-br ${tech.color} rounded-lg p-4 text-center border border-white/20 hover:border-white/40 transition-all duration-300 shadow-lg`}
                >
                  <div className="text-white font-semibold">{tech.name}</div>
                  <div className="text-white/80 text-xs mt-1">{tech.category}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Architecture Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            🏗️ Arquitetura do Sistema
          </h2>
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-700/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🎨
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Frontend</h3>
                <p className="text-gray-300 text-sm">
                  React 18 com TypeScript, Tailwind CSS e Framer Motion para animações fluidas
                </p>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚙️
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Backend</h3>
                <p className="text-gray-300 text-sm">
                  Node.js com FastAPI para IA, PostgreSQL e Redis para performance otimizada
                </p>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ☁️
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Cloud & DevOps</h3>
                <p className="text-gray-300 text-sm">
                  AWS com Docker, CI/CD automatizado e monitoramento em tempo real
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mozambican Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-800/50 to-red-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30">
            <h2 className="text-3xl font-bold text-white mb-6">
              🇲🇿 Orgulhosamente Moçambicano
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💳
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Pagamentos Locais</h3>
                <p className="text-gray-300 text-sm">
                  Integração completa com M-Pesa, E-mola e bancos moçambicanos
                </p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚚
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Entrega Nacional</h3>
                <p className="text-gray-300 text-sm">
                  Cobertura em todas as 11 províncias com rastreamento em tempo real
                </p>
              </motion.div>
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🛠️
                </motion.div>
                <h3 className="font-semibold text-white mb-2">Suporte Local</h3>
                <p className="text-gray-300 text-sm">
                  Atendimento em português com conhecimento do mercado local
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;