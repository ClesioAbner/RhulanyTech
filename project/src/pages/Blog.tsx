import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'setup' | 'comparativo' | 'noticias' | 'guias' | 'reviews' | 'tutoriais';
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured?: boolean;
  views: number;
  likes: number;
  comments: Comment[];
  aiGenerated?: boolean;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  relatedProducts?: string[];
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como Montar o Setup Gaming Perfeito em 2024',
    excerpt: 'Guia completo para criar um setup gaming que impressiona e oferece máxima performance.',
    content: `
# Como Montar o Setup Gaming Perfeito em 2024

## 🎮 Introdução

Montar um setup gaming perfeito vai muito além de apenas comprar os componentes mais caros. É sobre criar um ambiente harmonioso que combine performance, estética e conforto para longas sessões de jogo.

## 💻 Componentes Essenciais

### 1. Computador Gaming
- **Processador**: Intel i7/i9 ou AMD Ryzen 7/9
- **Placa de Vídeo**: RTX 4070/4080/4090 para 4K
- **RAM**: Mínimo 32GB DDR5 para gaming moderno
- **Armazenamento**: SSD NVMe 2TB+ para jogos

### 2. Monitor
- **Resolução**: 1440p 144Hz ou 4K 120Hz
- **Tecnologia**: IPS para cores ou TN para velocidade
- **Tamanho**: 27" para competitivo, 32"+ para imersão

### 3. Periféricos
- **Mouse**: Sensor óptico 25K+ DPI, peso < 70g
- **Teclado**: Mecânico com switches lineares
- **Headset**: Audio espacial e microfone com cancelamento

## 🎨 Design e Estética

### Iluminação RGB
- Sincronize todas as luzes com software único
- Use cores que não cansem a vista
- Considere iluminação ambiente atrás do monitor

### Organização de Cabos
- Use passadores e organizadores
- Roteie cabos por baixo da mesa
- Invista em cabos sleeved para visual premium

## 🪑 Ergonomia e Conforto

### Cadeira Gaming
- Suporte lombar ajustável
- Apoio de braços 4D
- Material respirável

### Mesa
- Altura ajustável (68-76cm)
- Profundidade mínima 60cm
- Superfície lisa para mouse

## 💡 Dicas Profissionais

1. **Teste antes de comprar**: Sempre que possível
2. **Invista em qualidade**: Periféricos duram anos
3. **Planeje o upgrade**: Compre pensando no futuro
4. **Considere o ambiente**: Ventilação e temperatura

## 🛒 Lista de Compras Recomendada

### Setup Iniciante (150.000 MT)
- PC Gaming RTX 4060 + Ryzen 5
- Monitor 1440p 144Hz
- Periféricos básicos de qualidade

### Setup Intermediário (300.000 MT)
- PC Gaming RTX 4070 + Ryzen 7
- Monitor 1440p 165Hz premium
- Periféricos gaming avançados

### Setup Profissional (500.000+ MT)
- PC Gaming RTX 4080/4090 + i9/Ryzen 9
- Monitor 4K 144Hz ou dual monitor
- Periféricos top de linha

## 🎯 Conclusão

Um setup gaming perfeito é um investimento a longo prazo. Priorize qualidade sobre quantidade e monte gradualmente. Na Rhulany Tech, temos todos os componentes para realizar seu sonho gaming!
    `,
    category: 'setup',
    author: 'Eclesio Pembelane',
    date: '2024-01-15',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800',
    tags: ['gaming', 'setup', 'hardware', 'guia'],
    featured: true,
    views: 2847,
    likes: 234,
    comments: [],
    difficulty: 'intermediario',
    relatedProducts: ['6', '20', '14']
  },
  {
    id: '2',
    title: 'MacBook Pro M3 vs Dell XPS 17: Qual Escolher?',
    excerpt: 'Comparativo detalhado entre os dois laptops premium mais desejados do mercado.',
    content: `
# MacBook Pro M3 vs Dell XPS 17: Qual Escolher?

## 🔍 Visão Geral

Dois gigantes do mercado de laptops premium se enfrentam: o revolucionário MacBook Pro M3 e o poderoso Dell XPS 17. Cada um com suas forças únicas.

## 💻 Especificações Técnicas

### MacBook Pro M3 Max 16"
- **Processador**: Apple M3 Max (12-core CPU)
- **GPU**: 40-core GPU integrada
- **RAM**: Até 128GB unificada
- **Tela**: 16.2" Liquid Retina XDR
- **Bateria**: Até 22 horas
- **Peso**: 2.16 kg

### Dell XPS 17
- **Processador**: Intel Core i9-13900H
- **GPU**: NVIDIA RTX 4080 12GB
- **RAM**: Até 64GB DDR5
- **Tela**: 17" 4K OLED opcional
- **Bateria**: Até 8 horas
- **Peso**: 2.51 kg

## ⚡ Performance

### MacBook Pro M3
- **Vantagens**: Eficiência energética excepcional, performance por watt líder
- **Ideal para**: Edição de vídeo 4K/8K, desenvolvimento iOS, design gráfico
- **Limitações**: Gaming limitado, compatibilidade com software Windows

### Dell XPS 17
- **Vantagens**: GPU dedicada poderosa, compatibilidade universal
- **Ideal para**: Gaming, renderização 3D, desenvolvimento multiplataforma
- **Limitações**: Menor autonomia, aquecimento sob carga

## 🎨 Display e Design

### MacBook Pro
- **Tela**: Mini-LED com 1000 nits, cores P3
- **Design**: Alumínio premium, acabamento impecável
- **Conectividade**: Thunderbolt 4, MagSafe 3

### Dell XPS
- **Tela**: OLED 4K opcional, cores vibrantes
- **Design**: Carbon fiber e alumínio
- **Conectividade**: Thunderbolt 4, USB-A, SD card

## 💰 Custo-Benefício

### MacBook Pro M3 (450.000 MT)
- **Prós**: Durabilidade, suporte longo, revenda alta
- **Contras**: Preço premium, upgrades limitados

### Dell XPS 17 (320.000 MT)
- **Prós**: Preço mais acessível, upgrades possíveis
- **Contras**: Depreciação mais rápida

## 🎯 Veredicto

### Escolha MacBook Pro se:
- Trabalha com edição de vídeo profissional
- Valoriza autonomia de bateria
- Está no ecossistema Apple
- Prioriza eficiência energética

### Escolha Dell XPS 17 se:
- Precisa de gaming ou GPU dedicada
- Trabalha com software Windows específico
- Quer melhor custo-benefício
- Precisa de mais conectividade

## 🛒 Onde Comprar

Ambos disponíveis na Rhulany Tech com:
- ✅ Garantia estendida
- ✅ Suporte técnico especializado
- ✅ Financiamento facilitado
- ✅ Entrega em todo Moçambique
    `,
    category: 'comparativo',
    author: 'Nelson Mombi',
    date: '2024-01-12',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800',
    tags: ['laptop', 'comparativo', 'macbook', 'dell'],
    views: 1923,
    likes: 187,
    comments: [],
    difficulty: 'intermediario',
    relatedProducts: ['6', '8']
  },
  {
    id: '3',
    title: 'RTX 4090 vs RTX 4080: Vale a Pena o Upgrade?',
    excerpt: 'Análise completa das duas placas de vídeo mais poderosas da NVIDIA.',
    content: `
# RTX 4090 vs RTX 4080: Vale a Pena o Upgrade?

## 🚀 Introdução

A NVIDIA lançou suas placas de vídeo mais poderosas da série RTX 40. Mas será que a RTX 4090 justifica o preço premium sobre a RTX 4080?

## 📊 Especificações Técnicas

### RTX 4090
- **CUDA Cores**: 16.384
- **VRAM**: 24GB GDDR6X
- **Memory Bus**: 384-bit
- **TDP**: 450W
- **Preço**: 220.000 MT

### RTX 4080
- **CUDA Cores**: 9.728
- **VRAM**: 16GB GDDR6X
- **Memory Bus**: 256-bit
- **TDP**: 320W
- **Preço**: 180.000 MT

## 🎮 Performance Gaming

### 4K Gaming
- **RTX 4090**: 90-120 FPS (Ultra settings)
- **RTX 4080**: 70-90 FPS (Ultra settings)
- **Diferença**: ~25% a favor da 4090

### 1440p Gaming
- **RTX 4090**: 120+ FPS (todas as configurações)
- **RTX 4080**: 100-120 FPS (Ultra settings)
- **Diferença**: Ambas excelentes

### Ray Tracing
- **RTX 4090**: Performance superior em todos os jogos
- **RTX 4080**: Ótima performance, mas limitada em alguns títulos

## 🎨 Criação de Conteúdo

### Renderização 3D
- **RTX 4090**: 40-50% mais rápida
- **24GB VRAM**: Crucial para cenas complexas
- **RTX 4080**: Excelente para projetos médios

### Edição de Vídeo
- **RTX 4090**: Melhor para 8K e múltiplas streams
- **RTX 4080**: Perfeita para 4K profissional

## ⚡ Consumo e Temperatura

### RTX 4090
- **Consumo**: 450W (sistema 850W+ recomendado)
- **Temperatura**: 70-80°C sob carga
- **Ruído**: Moderado a alto

### RTX 4080
- **Consumo**: 320W (sistema 750W+ recomendado)
- **Temperatura**: 65-75°C sob carga
- **Ruído**: Moderado

## 💰 Custo-Benefício

### RTX 4090 (220.000 MT)
- **Vantagens**: Performance máxima, futuro-prova
- **Desvantagens**: Preço alto, consumo elevado

### RTX 4080 (180.000 MT)
- **Vantagens**: Excelente performance/preço
- **Desvantagens**: Limitada para criação profissional

## 🎯 Recomendações

### Compre RTX 4090 se:
- Joga em 4K com ray tracing máximo
- Trabalha com renderização 3D profissional
- Edita vídeo 8K regularmente
- Quer a melhor placa por 3-4 anos

### Compre RTX 4080 se:
- Joga principalmente em 1440p
- Trabalha com criação de conteúdo moderada
- Tem orçamento mais limitado
- Sistema com fonte menor

## 🔮 Futuro

Ambas as placas são "futuro-prova" para os próximos 3-4 anos. A RTX 4090 oferece mais margem para jogos futuros, enquanto a RTX 4080 é mais equilibrada.

## 🛒 Disponibilidade

Ambas disponíveis na Rhulany Tech com:
- ✅ Garantia de 3 anos
- ✅ Instalação gratuita
- ✅ Teste de stress incluído
- ✅ Suporte técnico vitalício
    `,
    category: 'comparativo',
    author: 'Edilson Malache',
    date: '2024-01-10',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800',
    tags: ['gpu', 'nvidia', 'gaming', 'comparativo'],
    views: 3421,
    likes: 298,
    comments: [],
    difficulty: 'avancado',
    relatedProducts: ['20']
  }
];

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
