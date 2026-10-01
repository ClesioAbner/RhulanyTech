import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';
import { blogPosts, type BlogPost } from '../data/blog';

const Blog = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (postId) {
      const post = blogPosts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        // Incrementar views
        post.views += 1;
      }
    }
  }, [postId]);

  useEffect(() => {
    const handleScroll = () => {
      if (selectedPost) {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  const categories = [
    { id: 'all', name: 'Todos os Posts', icon: '📚', count: blogPosts.length },
    { id: 'setup', name: 'Setup Gaming', icon: '🎮', count: blogPosts.filter(p => p.category === 'setup').length },
    { id: 'comparativo', name: 'Comparativos', icon: '⚖️', count: blogPosts.filter(p => p.category === 'comparativo').length },
    { id: 'noticias', name: 'Notícias', icon: '📰', count: blogPosts.filter(p => p.category === 'noticias').length },
    { id: 'guias', name: 'Guias', icon: '📖', count: blogPosts.filter(p => p.category === 'guias').length },
    { id: 'reviews', name: 'Reviews', icon: '⭐', count: blogPosts.filter(p => p.category === 'reviews').length },
    { id: 'tutoriais', name: 'Tutoriais', icon: '🎓', count: blogPosts.filter(p => p.category === 'tutoriais').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const generateAIPost = async () => {
    if (!aiPrompt.trim()) {
      toast.error('❌ Digite um tópico para gerar o post');
      return;
    }

    setIsGeneratingPost(true);
    
    try {
      const prompt = `
      Crie um post completo para o blog da Rhulany Tech sobre: "${aiPrompt}"
      
      O post deve incluir:
      1. Título atrativo e SEO-friendly
      2. Excerpt/resumo de 1-2 linhas
      3. Conteúdo completo em markdown com pelo menos 1000 palavras
      4. Seções bem estruturadas com emojis
      5. Dicas práticas e exemplos
      6. Recomendações de produtos da Rhulany Tech quando relevante
      7. Conclusão com call-to-action
      
      Formato: JSON com campos title, excerpt, content, category, tags, difficulty
      
      Seja técnico mas acessível, use linguagem de Moçambique, e foque em valor real para o leitor.
      `;

      const aiResponse = await geminiService.getUniversalResponse(prompt, {
        category: 'blog_generation',
        userContext: currentUser
      });

      // Simular resposta estruturada da IA
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: `${aiPrompt} - Guia Completo 2024`,
        excerpt: `Tudo que você precisa saber sobre ${aiPrompt.toLowerCase()} com dicas práticas e recomendações especializadas.`,
        content: aiResponse,
        category: 'guias',
        author: 'Rhulany AI',
        date: new Date().toISOString().split('T')[0],
        readTime: '5-8 min',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800',
        tags: aiPrompt.split(' ').slice(0, 4),
        views: 0,
        likes: 0,
        comments: [],
        aiGenerated: true,
        difficulty: 'intermediario'
      };

      blogPosts.unshift(newPost);
      setAiPrompt('');
      setShowAIGenerator(false);
      
      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🤖
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Post Gerado pela IA!</h3>
            <p className="text-sm opacity-90">
              Novo conteúdo criado com Gemini AI
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });

    } catch (error) {
      toast.error('❌ Erro ao gerar post. Tente novamente.');
      console.error('Error generating AI post:', error);
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    toast.success(bookmarkedPosts.includes(postId) ? '🔖 Removido dos favoritos' : '⭐ Adicionado aos favoritos');
  };

  const likePost = (postId: string) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      toast.success('❤️ Post curtido!');
    }
  };

  const sharePost = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('🔗 Link copiado para a área de transferência!');
    }
  };

  // Visualização de post individual
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${readingProgress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <motion.button
            onClick={() => {
              setSelectedPost(null);
              navigate('/blog');
            }}
            className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            whileHover={{ x: -5 }}
          >
            ← Voltar ao Blog
          </motion.button>

          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative mb-8">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPost.category === 'setup' ? 'bg-green-500/20 text-green-400' :
                    selectedPost.category === 'comparativo' ? 'bg-blue-500/20 text-blue-400' :
                    selectedPost.category === 'noticias' ? 'bg-red-500/20 text-red-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {categories.find(c => c.id === selectedPost.category)?.icon} {categories.find(c => c.id === selectedPost.category)?.name}
                  </span>
                  {selectedPost.aiGenerated && (
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🤖 IA Generated
                    </span>
                  )}
                  {selectedPost.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPost.difficulty === 'iniciante' ? 'bg-green-500/20 text-green-400' :
                      selectedPost.difficulty === 'intermediario' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedPost.difficulty === 'iniciante' ? '🌱 Iniciante' :
                       selectedPost.difficulty === 'intermediario' ? '⚡ Intermediário' :
                       '🔥 Avançado'}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
                <div className="flex items-center gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedPost.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{selectedPost.author}</span>
                  </div>
                  <span>📅 {selectedPost.date}</span>
                  <span>⏱️ {selectedPost.readTime}</span>
                  <span>👁️ {selectedPost.views.toLocaleString()}</span>
                  <span>❤️ {selectedPost.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => likePost(selectedPost.id)}
                className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                ❤️ Curtir ({selectedPost.likes})
              </button>
              <button
                onClick={() => toggleBookmark(selectedPost.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                  bookmarkedPosts.includes(selectedPost.id)
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {bookmarkedPosts.includes(selectedPost.id) ? '⭐ Favoritado' : '🔖 Favoritar'}
              </button>
              <button
                onClick={() => sharePost(selectedPost)}
                className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                🔗 Compartilhar
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              Progresso: {Math.round(readingProgress)}%
            </div>
          </motion.div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-2xl mb-8"
          >
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: selectedPost.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h2>').replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800">') 
              }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchTerm(tag);
                    setSelectedPost(null);
                    navigate('/blog');
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">📚 Posts Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.id !== selectedPost.id && p.category === selectedPost.category)
                .slice(0, 2)
                .map((post) => (
                  <motion.div
                    key={post.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedPost(post);
                      navigate(`/blog/${post.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-white mb-2 line-clamp-2">{post.title}</h4>
                      <p className="text-gray-300 text-sm line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-400 text-xs">{post.readTime}</span>
                        <span className="text-blue-400 text-xs">👁️ {post.views}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
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
              📚
            </motion.span>
            Blog Rhulany Tech
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Conteúdo educativo sobre tecnologia, gaming e hardware. 
            Guias, comparativos e as últimas notícias do mundo tech.
          </p>
        </motion.div>

        {/* AI Post Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🤖</span> Gerador de Posts com IA Gemini
              </h2>
              <button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
              >
                {showAIGenerator ? 'Fechar' : 'Abrir Gerador'}
              </button>
            </div>
            
            <AnimatePresence>
              {showAIGenerator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <p className="text-purple-200">
                    Nossa IA Gemini pode criar posts completos sobre qualquer tópico tech. 
                    Digite um assunto e deixe a magia acontecer!
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ex: Como escolher uma placa de vídeo para gaming..."
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && !isGeneratingPost && generateAIPost()}
                    />
                    <button
                      onClick={generateAIPost}
                      disabled={isGeneratingPost || !aiPrompt.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGeneratingPost ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <span>✨</span> Gerar Post
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Melhor setup gaming 2024',
                      'iPhone vs Android para criadores',
                      'Como montar PC para streaming',
                      'Tendências tech em Moçambique',
                      'Guia de periféricos gaming'
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setAiPrompt(suggestion)}
                        className="bg-purple-700/50 text-purple-200 px-3 py-1 rounded-full text-sm hover:bg-purple-600/50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Buscar posts, tags ou tópicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">📅 Mais Recentes</option>
                  <option value="views">👁️ Mais Visualizados</option>
                  <option value="likes">❤️ Mais Curtidos</option>
                  <option value="title">🔤 Alfabética</option>
                </select>
                <div className="flex bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400'
                    }`}
                  >
                    ⊞ Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'
                    }`}
                  >
                    ☰ Lista
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
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
        </motion.div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
              <span>⭐</span> Posts em Destaque
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => {
                    setSelectedPost(post);
                    navigate(`/blog/${post.id}`);
                  }}
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Destaque
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {post.readTime}
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        👁️ {post.views.toLocaleString()}
                      </span>
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        ❤️ {post.likes}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.category === 'setup' ? 'bg-green-500/20 text-green-400' :
                        post.category === 'comparativo' ? 'bg-blue-500/20 text-blue-400' :
                        post.category === 'noticias' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className="text-gray-400 text-sm">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-gray-400 text-sm">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(post.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarkedPosts.includes(post.id)
                              ? 'text-yellow-400 bg-yellow-500/20'
                              : 'text-gray-400 hover:text-yellow-400'
                          }`}
                        >
                          {bookmarkedPosts.includes(post.id) ? '⭐' : '🔖'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sharePost(post);
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <span>📖</span> 
              {selectedCategory === 'all' ? 'Todos os Posts' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-gray-400">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post encontrado' : 'posts encontrados'}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                  onClick={() => {
                    setSelectedPost(post);
                    navigate(`/blog/${post.id}`);
                  }}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                      }`}
                    />
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {post.readTime}
                    </div>
                    {post.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐
                      </div>
                    )}
                    {post.aiGenerated && (
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🤖 IA
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.category === 'setup' ? 'bg-green-500/20 text-green-400' :
                        post.category === 'comparativo' ? 'bg-blue-500/20 text-blue-400' :
                        post.category === 'noticias' ? 'bg-red-500/20 text-red-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <span className="text-gray-400 text-xs">{post.date}</span>
                      {post.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.difficulty === 'iniciante' ? 'bg-green-500/20 text-green-400' :
                          post.difficulty === 'intermediario' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {post.difficulty === 'iniciante' ? '🌱' :
                           post.difficulty === 'intermediario' ? '⚡' : '🔥'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-600/50 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm(tag);
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-gray-400 text-xs">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          👁️ {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ {post.likes}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(post.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            bookmarkedPosts.includes(post.id)
                              ? 'text-yellow-400'
                              : 'text-gray-400 hover:text-yellow-400'
                          }`}
                        >
                          {bookmarkedPosts.includes(post.id) ? '⭐' : '🔖'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">📧 Newsletter Tech</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Receba as últimas notícias, guias e comparativos diretamente no seu email. 
              Conteúdo exclusivo para assinantes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Assinar Grátis
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              ✅ Sem spam • ✅ Cancele quando quiser • ✅ Conteúdo exclusivo
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
