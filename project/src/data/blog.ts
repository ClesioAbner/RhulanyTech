export interface BlogPost {
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

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

export const blogPosts: BlogPost[] = [
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
