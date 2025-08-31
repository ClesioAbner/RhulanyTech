export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: 'computadores' | 'perifericos' | 'componentes' | 'celulares' | 'consoles' | 'acessorios';
  specs: string[];
  inStock: boolean;
  stockQuantity: number;
  discount?: number;
  rating: number;
  reviews: number;
  brand: string;
  model: string;
  warranty: string;
  features: string[];
  dimensions?: string;
  weight?: string;
  colors?: string[];
  tags: string[];
}

export const products: Product[] = [
  // Celulares Premium
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    price: 180000,
    originalPrice: 200000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&angle=90',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&angle=135',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&angle=180'
    ],
    description: 'O mais avançado iPhone com chip A17 Pro, câmera de 48MP e design em titânio',
    category: 'celulares',
    specs: ['Chip A17 Pro', 'Tela 6.7" Super Retina XDR', 'Câmera 48MP', '256GB', 'Titânio Natural'],
    inStock: true,
    stockQuantity: 15,
    discount: 10,
    rating: 4.9,
    reviews: 2847,
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    warranty: '1 ano Apple Care',
    features: ['Face ID', 'Resistente à água IP68', 'MagSafe', 'Lightning para USB-C', '5G'],
    dimensions: '159.9 x 76.7 x 8.25 mm',
    weight: '221g',
    colors: ['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto'],
    tags: ['premium', 'flagship', 'camera', 'gaming', 'professional']
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    price: 165000,
    originalPrice: 185000,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&angle=90',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&angle=135'
    ],
    description: 'Smartphone premium com S Pen integrada, câmera de 200MP e IA avançada',
    category: 'celulares',
    specs: ['Snapdragon 8 Gen 3', 'Tela 6.8" Dynamic AMOLED 2X', 'Câmera 200MP', '512GB', 'S Pen incluída'],
    inStock: true,
    stockQuantity: 12,
    discount: 11,
    rating: 4.8,
    reviews: 1923,
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    warranty: '2 anos Samsung Care+',
    features: ['S Pen', 'Galaxy AI', 'Zoom 100x', 'DeX Mode', '5G'],
    dimensions: '162.3 x 79.0 x 8.6 mm',
    weight: '232g',
    colors: ['Phantom Black', 'Phantom Silver', 'Phantom Violet'],
    tags: ['premium', 'productivity', 'camera', 's-pen', 'ai']
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro 256GB',
    price: 145000,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&angle=90'
    ],
    description: 'IA avançada do Google, fotografia computacional de última geração',
    category: 'celulares',
    specs: ['Google Tensor G3', 'Tela 6.7" LTPO OLED', 'Câmera 50MP', '256GB', 'Magic Eraser'],
    inStock: true,
    stockQuantity: 8,
    rating: 4.7,
    reviews: 1456,
    brand: 'Google',
    model: 'Pixel 8 Pro',
    warranty: '2 anos Google',
    features: ['Magic Eraser', 'Night Sight', 'Live Translate', 'Call Screen', 'Pure Android'],
    dimensions: '162.6 x 76.5 x 8.8 mm',
    weight: '213g',
    colors: ['Obsidian', 'Porcelain', 'Bay'],
    tags: ['ai', 'camera', 'pure-android', 'computational-photography']
  },
  {
    id: '4',
    name: 'OnePlus 12 256GB',
    price: 125000,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Performance flagship com carregamento ultra-rápido 100W',
    category: 'celulares',
    specs: ['Snapdragon 8 Gen 3', 'Tela 6.82" AMOLED 120Hz', 'Câmera 50MP Hasselblad', '256GB', 'Carregamento 100W'],
    inStock: true,
    stockQuantity: 11,
    rating: 4.6,
    reviews: 567,
    brand: 'OnePlus',
    model: 'OnePlus 12',
    warranty: '2 anos OnePlus',
    features: ['100W SuperVOOC', 'Hasselblad Camera', 'OxygenOS', 'Alert Slider', '5G'],
    dimensions: '164.3 x 75.8 x 9.15 mm',
    weight: '220g',
    colors: ['Flowy Emerald', 'Silky Black'],
    tags: ['flagship', 'fast-charging', 'hasselblad', 'performance', '5g']
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra 512GB',
    price: 115000,
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800'
    ],
    description: 'Câmera profissional Leica em smartphone com zoom periscópico',
    category: 'celulares',
    specs: ['Snapdragon 8 Gen 3', 'Tela 6.73" AMOLED', 'Câmera Leica 50MP', '512GB', 'IP68'],
    inStock: true,
    stockQuantity: 9,
    rating: 4.5,
    reviews: 423,
    brand: 'Xiaomi',
    model: '14 Ultra',
    warranty: '2 anos Xiaomi',
    features: ['Leica Camera', 'Periscope Zoom', 'MIUI 15', 'Wireless Charging', 'IP68'],
    dimensions: '161.4 x 75.3 x 9.2 mm',
    weight: '229g',
    colors: ['Black', 'White'],
    tags: ['camera', 'leica', 'zoom', 'flagship', 'photography']
  },

  // Computadores Gaming
  {
    id: '6',
    name: 'MacBook Pro 16" M3 Max 64GB',
    price: 450000,
    originalPrice: 480000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&angle=90',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&angle=135'
    ],
    description: 'O mais poderoso MacBook Pro com chip M3 Max para profissionais criativos',
    category: 'computadores',
    specs: ['Chip M3 Max', 'GPU 40 núcleos', '64GB RAM unificada', 'SSD 2TB', 'Tela Liquid Retina XDR 16"'],
    inStock: true,
    stockQuantity: 5,
    discount: 6,
    rating: 4.9,
    reviews: 892,
    brand: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    warranty: '1 ano Apple Care',
    features: ['Touch ID', 'Magic Keyboard', 'Force Touch', 'Thunderbolt 4', 'ProRes'],
    dimensions: '35.57 x 24.81 x 1.68 cm',
    weight: '2.16 kg',
    colors: ['Space Gray', 'Silver'],
    tags: ['professional', 'creative', 'video-editing', 'development', 'premium']
  },
  {
    id: '8',
    name: 'Dell XPS 17 Creator Edition',
    price: 320000,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Workstation premium com tela 4K OLED e RTX 4080 para criadores',
    category: 'computadores',
    specs: ['Intel Core i9-13900H', 'RTX 4080 12GB', '64GB DDR5', 'SSD 2TB NVMe', 'Tela 17" 4K OLED'],
    inStock: true,
    stockQuantity: 4,
    rating: 4.7,
    reviews: 423,
    brand: 'Dell',
    model: 'XPS 17',
    warranty: '3 anos Dell ProSupport',
    features: ['4K OLED', 'Thunderbolt 4', 'WiFi 6E', 'Precision Touchpad', 'Carbon Fiber'],
    dimensions: '37.45 x 24.8 x 1.99 cm',
    weight: '2.51 kg',
    colors: ['Platinum Silver', 'Graphite'],
    tags: ['workstation', 'creative', '4k', 'oled', 'professional']
  },
  {
    id: '9',
    name: 'Alienware Aurora R15 Gaming Desktop',
    price: 280000,
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Desktop gaming premium com design futurista e performance extrema',
    category: 'computadores',
    specs: ['Intel Core i9-13900F', 'RTX 4080 16GB', '32GB DDR5', 'SSD 1TB NVMe', 'Liquid Cooling'],
    inStock: true,
    stockQuantity: 6,
    rating: 4.8,
    reviews: 756,
    brand: 'Dell',
    model: 'Alienware Aurora R15',
    warranty: '2 anos Dell',
    features: ['RGB Lighting', 'Liquid Cooling', 'Tool-less Upgrade', 'Killer WiFi 6E', 'VR Ready'],
    dimensions: '48.1 x 21.8 x 43.9 cm',
    weight: '18.6 kg',
    colors: ['Lunar Light', 'Dark Side of the Moon'],
    tags: ['gaming', 'desktop', 'rgb', 'high-performance', 'vr-ready']
  },

  // Consoles Gaming
  {
    id: '10',
    name: 'PlayStation 5 Pro 2TB',
    price: 450000,
    originalPrice: 480000,
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&angle=90'
    ],
    description: 'Console de nova geração com ray tracing avançado e gaming em 8K',
    category: 'consoles',
    specs: ['AMD Zen 2 8-core 3.5GHz', 'GPU RDNA 2 Custom', '16GB GDDR6', 'SSD 2TB NVMe', '8K Gaming Ready'],
    inStock: true,
    stockQuantity: 10,
    discount: 6,
    rating: 4.9,
    reviews: 3421,
    brand: 'Sony',
    model: 'PlayStation 5 Pro',
    warranty: '1 ano Sony',
    features: ['Ray Tracing', '3D Audio', 'DualSense Controller', 'Backward Compatibility', '4K Blu-ray'],
    dimensions: '39 x 26 x 10.4 cm',
    weight: '4.5 kg',
    colors: ['White'],
    tags: ['next-gen', 'ray-tracing', '8k', 'exclusive-games', 'vr-ready']
  },
  {
    id: '11',
    name: 'Xbox Series X 1TB',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'O Xbox mais poderoso de todos os tempos com Game Pass Ultimate',
    category: 'consoles',
    specs: ['AMD Zen 2 8-core 3.8GHz', 'GPU RDNA 2 Custom', '16GB GDDR6', 'SSD 1TB NVMe', '4K 120fps'],
    inStock: true,
    stockQuantity: 8,
    rating: 4.8,
    reviews: 2156,
    brand: 'Microsoft',
    model: 'Xbox Series X',
    warranty: '1 ano Microsoft',
    features: ['Quick Resume', 'Smart Delivery', 'Auto HDR', 'Game Pass', 'Backward Compatibility'],
    dimensions: '30.1 x 15.1 x 15.1 cm',
    weight: '4.45 kg',
    colors: ['Matte Black'],
    tags: ['powerful', 'game-pass', '4k-120fps', 'quick-resume', 'backwards-compatible']
  },
  {
    id: '12',
    name: 'Nintendo Switch OLED 64GB',
    price: 280000,
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Console híbrido com tela OLED vibrante e exclusivos Nintendo',
    category: 'consoles',
    specs: ['NVIDIA Tegra X1', 'Tela OLED 7"', '64GB Storage', 'Dock TV incluído', 'Portátil/TV'],
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviews: 4892,
    brand: 'Nintendo',
    model: 'Switch OLED',
    warranty: '1 ano Nintendo',
    features: ['OLED Screen', 'Detachable Joy-Cons', 'HD Rumble', 'Motion Controls', 'Local Multiplayer'],
    dimensions: '24.2 x 13.9 x 2.8 cm',
    weight: '420g',
    colors: ['White', 'Neon Red/Blue'],
    tags: ['portable', 'oled', 'family-friendly', 'exclusive-games', 'hybrid']
  },
  {
    id: '13',
    name: 'Steam Deck OLED 1TB',
    price: 380000,
    images: [
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800'
    ],
    description: 'Console portátil PC gaming com tela OLED e acesso à biblioteca Steam',
    category: 'consoles',
    specs: ['AMD Zen 2 APU', 'Tela OLED 7.4"', '1TB NVMe SSD', 'Steam OS', 'Controles integrados'],
    inStock: true,
    stockQuantity: 12,
    rating: 4.6,
    reviews: 1234,
    brand: 'Valve',
    model: 'Steam Deck OLED',
    warranty: '1 ano Valve',
    features: ['OLED HDR', 'Steam Library', 'Desktop Mode', 'Dock Support', 'Modular'],
    dimensions: '29.8 x 11.7 x 4.9 cm',
    weight: '640g',
    colors: ['Black'],
    tags: ['portable', 'pc-gaming', 'steam', 'oled', 'handheld']
  },

  // Periféricos Gaming
  {
    id: '14',
    name: 'Logitech MX Master 3S Wireless',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Mouse wireless premium para produtividade com scroll MagSpeed',
    category: 'perifericos',
    specs: ['Sensor Darkfield 8000 DPI', 'Bateria 70 dias', 'USB-C', 'Scroll MagSpeed', 'Multi-device'],
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviews: 1847,
    brand: 'Logitech',
    model: 'MX Master 3S',
    warranty: '2 anos Logitech',
    features: ['MagSpeed Scroll', 'Flow Technology', 'Gesture Button', 'USB-C Fast Charge', 'Ergonomic'],
    dimensions: '12.4 x 8.4 x 5.1 cm',
    weight: '141g',
    colors: ['Graphite', 'Pale Gray', 'Rose'],
    tags: ['productivity', 'wireless', 'ergonomic', 'multi-device', 'professional']
  },
  {
    id: '15',
    name: 'Razer DeathAdder V3 Pro Gaming',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Mouse gaming wireless de alta performance para esports',
    category: 'perifericos',
    specs: ['Sensor Focus Pro 30K DPI', 'Switches ópticas Gen-3', 'HyperSpeed Wireless', '90h bateria', '59g'],
    inStock: true,
    stockQuantity: 18,
    rating: 4.9,
    reviews: 2341,
    brand: 'Razer',
    model: 'DeathAdder V3 Pro',
    warranty: '2 anos Razer',
    features: ['30K DPI Sensor', 'Optical Switches', 'HyperSpeed Wireless', 'Ergonomic Shape', 'Chroma RGB'],
    dimensions: '12.8 x 6.8 x 4.3 cm',
    weight: '59g',
    colors: ['Black', 'White'],
    tags: ['gaming', 'esports', 'wireless', 'high-dpi', 'lightweight']
  },
  {
    id: '16',
    name: 'Corsair K100 RGB Mechanical',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Teclado mecânico premium com switches ópticos e RGB avançado',
    category: 'perifericos',
    specs: ['Switches Cherry MX Speed Silver', 'RGB iCUE', 'Roda de controle', 'USB passthrough', 'Frame alumínio'],
    inStock: true,
    stockQuantity: 12,
    rating: 4.7,
    reviews: 987,
    brand: 'Corsair',
    model: 'K100 RGB',
    warranty: '2 anos Corsair',
    features: ['Optical Switches', 'iCUE RGB', 'Control Wheel', 'USB Passthrough', 'Aluminum Frame'],
    dimensions: '46.1 x 16.6 x 3.9 cm',
    weight: '1.2 kg',
    colors: ['Black'],
    tags: ['mechanical', 'rgb', 'premium', 'optical-switches', 'gaming']
  },
  {
    id: '17',
    name: 'SteelSeries Arctis Nova Pro Wireless',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Headset gaming premium com cancelamento de ruído ativo',
    category: 'perifericos',
    specs: ['Drivers 40mm neodímio', 'ANC ativo', 'Wireless 2.4GHz + Bluetooth', 'Bateria 38h', 'Hi-Res Audio'],
    inStock: true,
    stockQuantity: 14,
    rating: 4.8,
    reviews: 756,
    brand: 'SteelSeries',
    model: 'Arctis Nova Pro Wireless',
    warranty: '2 anos SteelSeries',
    features: ['Active Noise Cancellation', 'Dual Wireless', 'ClearCast Mic', 'GameDAC', 'Comfort Headband'],
    dimensions: '19.3 x 17.8 x 9.2 cm',
    weight: '338g',
    colors: ['Black', 'White'],
    tags: ['wireless', 'anc', 'gaming', 'premium', 'dual-wireless']
  },
  {
    id: '18',
    name: 'LG UltraGear 27GP950 4K 144Hz',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&angle=45'
    ],
    description: 'Monitor gaming 4K 144Hz com HDR600 e G-SYNC Compatible',
    category: 'perifericos',
    specs: ['Tela 27" 4K IPS', '144Hz G-SYNC', 'HDR600', '1ms GTG', 'USB-C 90W PD'],
    inStock: true,
    stockQuantity: 7,
    rating: 4.9,
    reviews: 1234,
    brand: 'LG',
    model: 'UltraGear 27GP950',
    warranty: '3 anos LG',
    features: ['4K 144Hz', 'G-SYNC Compatible', 'HDR600', 'USB-C Hub', 'Height Adjustable'],
    dimensions: '61.3 x 56.8 x 29.0 cm',
    weight: '6.1 kg',
    colors: ['Black'],
    tags: ['4k', '144hz', 'gaming', 'hdr', 'g-sync']
  },
  {
    id: '19',
    name: 'Logitech BRIO 4K Ultra HD',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800'
    ],
    description: 'Webcam 4K para streaming profissional e videoconferência',
    category: 'perifericos',
    specs: ['4K 30fps / 1080p 60fps', 'HDR', 'Campo de visão ajustável', 'Windows Hello', 'Microfones duplos'],
    inStock: true,
    stockQuantity: 20,
    rating: 4.6,
    reviews: 1089,
    brand: 'Logitech',
    model: 'BRIO 4K',
    warranty: '2 anos Logitech',
    features: ['4K Recording', 'HDR', 'Windows Hello', 'Background Replacement', 'Auto Focus'],
    dimensions: '10.2 x 2.7 x 2.7 cm',
    weight: '63g',
    colors: ['Black'],
    tags: ['4k', 'streaming', 'webcam', 'hdr', 'windows-hello']
  },

  // Componentes PC
  {
    id: '20',
    name: 'NVIDIA RTX 4090 24GB GDDR6X',
    price: 220000,
    originalPrice: 250000,
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&angle=45',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&angle=90'
    ],
    description: 'A placa de vídeo mais poderosa do mundo para gaming 4K e criação',
    category: 'componentes',
    specs: ['24GB GDDR6X', 'Ray Tracing 3ª gen', 'DLSS 3.5', 'PCIe 4.0', '450W TDP'],
    inStock: true,
    stockQuantity: 6,
    discount: 12,
    rating: 4.9,
    reviews: 1456,
    brand: 'NVIDIA',
    model: 'GeForce RTX 4090',
    warranty: '3 anos NVIDIA',
    features: ['Ray Tracing', 'DLSS 3.5', 'AV1 Encoding', '8K Gaming', 'Creator Ready'],
    dimensions: '30.4 x 13.7 x 6.1 cm',
    weight: '2.2 kg',
    colors: ['Black/Silver'],
    tags: ['flagship', '4k-gaming', 'ray-tracing', 'dlss', 'content-creation']
  },
  {
    id: '21',
    name: 'Intel Core i9-14900KS',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=800'
    ],
    description: 'Processador mais rápido para desktop gaming e criação de conteúdo',
    category: 'componentes',
    specs: ['24 núcleos (8P + 16E)', 'Até 6.2GHz Turbo', 'Cache 36MB', 'DDR5-5600', 'PCIe 5.0'],
    inStock: true,
    stockQuantity: 8,
    rating: 4.8,
    reviews: 743,
    brand: 'Intel',
    model: 'Core i9-14900KS',
    warranty: '3 anos Intel',
    features: ['Hybrid Architecture', 'Overclocking', 'DDR5 Support', 'PCIe 5.0', 'Intel Graphics'],
    dimensions: '4.5 x 3.7 x 0.1 cm',
    weight: '50g',
    colors: ['Silver'],
    tags: ['flagship', 'overclocking', 'gaming', 'content-creation', 'high-performance']
  },
  {
    id: '22',
    name: 'Samsung 990 PRO 4TB NVMe',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800'
    ],
    description: 'SSD NVMe PCIe 4.0 de alta velocidade para gaming e workstation',
    category: 'componentes',
    specs: ['4TB NVMe PCIe 4.0', '7450 MB/s leitura', '6900 MB/s escrita', 'V-NAND 3-bit MLC', '5 anos garantia'],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviews: 892,
    brand: 'Samsung',
    model: '990 PRO',
    warranty: '5 anos Samsung',
    features: ['PCIe 4.0', 'V-NAND Technology', 'Magician Software', 'Heat Spreader', 'Gaming Mode'],
    dimensions: '8.0 x 2.2 x 0.23 cm',
    weight: '8.5g',
    colors: ['Black'],
    tags: ['nvme', 'pcie4', 'high-speed', 'gaming', 'workstation']
  },
  {
    id: '23',
    name: 'Corsair Dominator Platinum RGB 64GB DDR5',
    price: 65000,
    images: [
      'https://images.unsplash.com/photo-1562976540-906c2ab2b2b4?auto=format&fit=crop&w=800'
    ],
    description: 'Memória RAM DDR5 premium com RGB e overclock extremo',
    category: 'componentes',
    specs: ['64GB (2x32GB)', 'DDR5-5600', 'RGB Lighting', 'Aluminum Heat Spreader', 'XMP 3.0'],
    inStock: true,
    stockQuantity: 10,
    rating: 4.7,
    reviews: 456,
    brand: 'Corsair',
    model: 'Dominator Platinum RGB',
    warranty: 'Lifetime Corsair',
    features: ['RGB Lighting', 'Overclocking', 'Heat Spreader', 'XMP 3.0', 'Premium Build'],
    dimensions: '13.3 x 0.7 x 5.1 cm',
    weight: '45g',
    colors: ['Black'],
    tags: ['ddr5', 'rgb', 'overclocking', 'premium', 'high-capacity']
  }
];