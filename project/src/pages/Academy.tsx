import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'strategy' | 'technical' | 'creative' | 'career' | 'psychology';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  price: number;
  instructor: string;
  image: string;
  tags: string[];
  featured?: boolean;
  new?: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  game: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  reward: string;
  deadline: string;
  participants: number;
  image: string;
}

const Academy = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'courses' | 'challenges' | 'mentorship'>('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Estratégias Avançadas de CS2',
      description: 'Domine táticas profissionais, posicionamento e teamplay para se tornar um jogador de elite',
      category: 'strategy',
      level: 'advanced',
      duration: '8 semanas',
      lessons: 24,
      students: 1247,
      rating: 4.9,
      price: 15000,
      instructor: 'Pro Player Gabriel "KSCERATO" Diniz',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800',
      tags: ['CS2', 'FPS', 'Estratégia', 'Competitivo'],
      featured: true
    },
    {
      id: '2',
      title: 'Criação de Conteúdo Gaming',
      description: 'Aprenda a criar, editar e monetizar conteúdo gaming para YouTube, Twitch e TikTok',
      category: 'creative',
      level: 'intermediate',
      duration: '6 semanas',
      lessons: 18,
      students: 892,
      rating: 4.8,
      price: 12000,
      instructor: 'Streamer Ana "GameQueen" Silva',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800',
      tags: ['Streaming', 'YouTube', 'Edição', 'Monetização'],
      new: true
    },
    {
      id: '3',
      title: 'Desenvolvimento de Jogos com Unity',
      description: 'Do conceito ao lançamento: crie seus próprios jogos 2D e 3D',
      category: 'technical',
      level: 'beginner',
      duration: '12 semanas',
      lessons: 36,
      students: 567,
      rating: 4.7,
      price: 25000,
      instructor: 'Dev Senior Carlos Machado',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800',
      tags: ['Unity', 'C#', 'Game Dev', 'Programação']
    },
    {
      id: '4',
      title: 'Psicologia da Performance Gaming',
      description: 'Controle mental, gestão de stress e técnicas para performance consistente',
      category: 'psychology',
      level: 'intermediate',
      duration: '4 semanas',
      lessons: 12,
      students: 423,
      rating: 4.9,
      price: 8000,
      instructor: 'Psicólogo Esportivo Dr. João Mateus',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800',
      tags: ['Psicologia', 'Performance', 'Mental', 'Competitivo']
    },
    {
      id: '5',
      title: 'Carreira no E-sports',
      description: 'Como se tornar profissional: contratos, patrocínios e gestão de carreira',
      category: 'career',
      level: 'advanced',
      duration: '6 semanas',
      lessons: 15,
      students: 234,
      rating: 4.6,
      price: 18000,
      instructor: 'Manager E-sports Rita Fernandes',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800',
      tags: ['E-sports', 'Carreira', 'Profissional', 'Negócios']
    },
    {
      id: '6',
      title: 'Setup Gaming Profissional',
      description: 'Monte o setup perfeito: hardware, configurações e otimizações',
      category: 'technical',
      level: 'beginner',
      duration: '3 semanas',
      lessons: 9,
      students: 1156,
      rating: 4.8,
      price: 6000,
      instructor: 'Tech Expert Miguel Santos',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800',
      tags: ['Hardware', 'Setup', 'Configuração', 'PC Gaming']
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Desafio Aim Training CS2',
      description: 'Melhore sua precisão em 7 dias com treinos específicos',
      game: 'Counter-Strike 2',
      difficulty: 'medium',
      reward: 'Skin AK-47 + 500 pontos',
      deadline: '2024-02-15',
      participants: 2847,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400'
    },
    {
      id: '2',
      title: 'Speedrun Valorant Ranked',
      description: 'Suba de rank o mais rápido possível em 30 dias',
      game: 'Valorant',
      difficulty: 'hard',
      reward: 'Coaching 1:1 + Periféricos Gaming',
      deadline: '2024-02-28',
      participants: 1523,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400'
    },
    {
      id: '3',
      title: 'Criação de Conteúdo Viral',
      description: 'Crie um vídeo gaming que alcance 100K views',
      game: 'Qualquer',
      difficulty: 'extreme',
      reward: 'Setup Streaming Completo',
      deadline: '2024-03-15',
      participants: 892,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos os Cursos', icon: '📚', count: courses.length },
    { id: 'strategy', name: 'Estratégia', icon: '🎯', count: courses.filter(c => c.category === 'strategy').length },
    { id: 'technical', name: 'Técnico', icon: '⚙️', count: courses.filter(c => c.category === 'technical').length },
    { id: 'creative', name: 'Criativo', icon: '🎨', count: courses.filter(c => c.category === 'creative').length },
    { id: 'psychology', name: 'Psicologia', icon: '🧠', count: courses.filter(c => c.category === 'psychology').length },
    { id: 'career', name: 'Carreira', icon: '🚀', count: courses.filter(c => c.category === 'career').length }
  ];

  const levels = [
    { id: 'all', name: 'Todos os Níveis', icon: '🎓' },
    { id: 'beginner', name: 'Iniciante', icon: '🌱' },
    { id: 'intermediate', name: 'Intermediário', icon: '⚡' },
    { id: 'advanced', name: 'Avançado', icon: '🔥' },
    { id: 'expert', name: 'Expert', icon: '👑' }
  ];

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-pink-500';
      case 'extreme': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      case 'expert': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🎓
            </motion.span>
            Academia Gamer Rhulany
          </h1>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Transforme sua paixão por games em carreira profissional. Aprenda com os melhores, 
            domine novas habilidades e conecte-se com a comunidade gaming de Moçambique.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
            {[
              { id: 'courses', label: '📚 Cursos', desc: 'Aprenda com especialistas' },
              { id: 'challenges', label: '🏆 Desafios', desc: 'Compete e ganhe prêmios' },
              { id: 'mentorship', label: '👥 Mentoria', desc: 'Coaching personalizado' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`px-6 py-4 rounded-xl transition-all font-medium ${
                  viewMode === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Courses View */}
          {viewMode === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Filters */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                <div className="space-y-6">
                  {/* Category Filters */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">📂 Categorias</h3>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <span>{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level Filters */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">🎯 Nível</h3>
                    <div className="flex flex-wrap gap-3">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setSelectedLevel(level.id)}
                          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                            selectedLevel === level.id
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <span>{level.icon}</span>
                          <span className="font-medium">{level.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Courses */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                  <span>⭐</span> Cursos em Destaque
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {courses.filter(c => c.featured).map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Destaque
                        </div>
                        <div className={`absolute top-4 right-4 bg-gradient-to-r ${getLevelColor(course.level)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                          {levels.find(l => l.id === course.level)?.icon} {levels.find(l => l.id === course.level)?.name}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {course.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-400">
                            <div>👨‍🏫 {course.instructor}</div>
                            <div>⏱️ {course.duration} • 📚 {course.lessons} aulas</div>
                            <div>👥 {course.students.toLocaleString()} estudantes</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="text-white font-bold">{course.rating}</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                              {course.price.toLocaleString('pt-MZ')} MT
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium">
                          🚀 Inscrever-se Agora
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* All Courses */}
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span>📚</span> Todos os Cursos
                  </h2>
                  <div className="text-gray-400">
                    {filteredCourses.length} cursos encontrados
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.new && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            🆕 Novo
                          </div>
                        )}
                        <div className={`absolute top-4 right-4 bg-gradient-to-r ${getLevelColor(course.level)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                          {levels.find(l => l.id === course.level)?.icon}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-xs text-gray-400">
                            <div>⏱️ {course.duration}</div>
                            <div>👥 {course.students.toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-yellow-400 text-sm">⭐</span>
                              <span className="text-white text-sm font-bold">{course.rating}</span>
                            </div>
                            <div className="text-lg font-bold text-green-400">
                              {course.price.toLocaleString('pt-MZ')} MT
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl hover:shadow-lg transition-all font-medium text-sm">
                          Ver Curso
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Challenges View */}
          {viewMode === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">🏆 Desafios Semanais</h2>
                <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                  Participe dos desafios, melhore suas habilidades e ganhe prêmios incríveis!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={challenge.image}
                        alt={challenge.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-4 left-4 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                        {challenge.difficulty.toUpperCase()}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {challenge.game}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                        {challenge.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4">
                        {challenge.description}
                      </p>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-green-400">
                          <span>🎁</span>
                          <span className="font-medium">Prêmio: {challenge.reward}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-400">
                          <span>⏰</span>
                          <span>Prazo: {challenge.deadline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                          <span>👥</span>
                          <span>{challenge.participants.toLocaleString()} participantes</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl hover:shadow-lg transition-all font-bold">
                        🚀 Participar do Desafio
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mentorship View */}
          {viewMode === 'mentorship' && (
            <motion.div
              key="mentorship"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">👥 Mentoria P2P</h2>
                <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                  Conecte-se com jogadores experientes ou torne-se um mentor. Aprendizado personalizado 1:1.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Become a Mentor */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-2xl p-8 border border-green-700/30"
                >
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎓</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Torne-se um Mentor</h3>
                    <p className="text-green-200">
                      Compartilhe seu conhecimento e ajude outros jogadores a evoluir
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-green-300">
                      <span>✅</span>
                      <span>Ganhe dinheiro ensinando</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-300">
                      <span>✅</span>
                      <span>Flexibilidade de horários</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-300">
                      <span>✅</span>
                      <span>Reconhecimento na comunidade</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-300">
                      <span>✅</span>
                      <span>Ferramentas de ensino incluídas</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg">
                    🚀 Candidatar-se como Mentor
                  </button>
                </motion.div>

                {/* Find a Mentor */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-blue-800/50 to-cyan-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30"
                >
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Encontre um Mentor</h3>
                    <p className="text-blue-200">
                      Acelere seu aprendizado com coaching personalizado
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-blue-300">
                      <span>🎮</span>
                      <span>Mentores especializados por jogo</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-300">
                      <span>📈</span>
                      <span>Progresso acompanhado</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-300">
                      <span>💬</span>
                      <span>Sessões ao vivo ou gravadas</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-300">
                      <span>⭐</span>
                      <span>Sistema de avaliação</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg">
                    🔍 Buscar Mentores
                  </button>
                </motion.div>
              </div>

              {/* Featured Mentors */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 text-center">⭐ Mentores em Destaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Gabriel "KSCERATO" Diniz',
                      game: 'CS2',
                      rank: 'Global Elite',
                      rating: 4.9,
                      sessions: 247,
                      price: 150,
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150'
                    },
                    {
                      name: 'Ana "GameQueen" Silva',
                      game: 'Valorant',
                      rank: 'Radiant',
                      rating: 4.8,
                      sessions: 189,
                      price: 120,
                      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150'
                    },
                    {
                      name: 'Carlos "DevMaster" Machado',
                      game: 'Game Development',
                      rank: 'Senior Dev',
                      rating: 4.9,
                      sessions: 156,
                      price: 200,
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150'
                    }
                  ].map((mentor, index) => (
                    <motion.div
                      key={mentor.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div className="text-center mb-4">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-purple-500"
                        />
                        <h4 className="font-bold text-white text-lg">{mentor.name}</h4>
                        <p className="text-purple-400">{mentor.game} • {mentor.rank}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-yellow-400">⭐ {mentor.rating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sessões:</span>
                          <span className="text-white">{mentor.sessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Preço/hora:</span>
                          <span className="text-green-400 font-bold">{mentor.price} MT</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl hover:shadow-lg transition-all font-medium">
                        📅 Agendar Sessão
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
            <h3 className="text-4xl font-bold text-white mb-6">
              Pronto para Elevar Seu Game?
            </h3>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Junte-se à maior comunidade gaming de Moçambique e transforme sua paixão em profissão
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
              >
                🛍️ Ver Equipamentos
              </Link>
              <a
                href="https://wa.me/258879596862"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
              >
                💬 Falar com Especialista
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Academy;
