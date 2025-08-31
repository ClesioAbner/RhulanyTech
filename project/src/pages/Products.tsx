import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCartStore } from '../stores/cartStore';
import Product360Viewer from '../components/Product360Viewer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Products = () => {
  const { addToCart } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [show360Viewer, setShow360Viewer] = useState(false);
  const [selected360Product, setSelected360Product] = useState<any>(null);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const filteredProducts = products
    .filter(p => selectedCategory ? p.category === selectedCategory : true)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = (product: any) => {
    if (!product.inStock) {
      toast.error('Produto fora de estoque');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={product.images[0]}
                alt={product.name}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {product.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Adicionado ao carrinho
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <Link
            to="/cart"
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            Ver Carrinho
          </Link>
        </div>
      </motion.div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  const handle360View = (product: any) => {
    setSelected360Product({
      ...product,
      images: product.images
    });
    setShow360Viewer(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">🛒 Nossos Produtos</h1>
        
        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="newest">Mais Recentes</option>
          </select>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Preço:</span>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-24"
            />
            <span className="text-sm text-gray-600">
              {priceRange[1].toLocaleString('pt-MZ')} MT
            </span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({products.length})
        </button>
        <button
          onClick={() => setSelectedCategory('celulares')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'celulares' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📱 Celulares ({products.filter(p => p.category === 'celulares').length})
        </button>
        <button
          onClick={() => setSelectedCategory('computadores')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'computadores' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          💻 Computadores ({products.filter(p => p.category === 'computadores').length})
        </button>
        <button
          onClick={() => setSelectedCategory('perifericos')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'perifericos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🖱️ Periféricos ({products.filter(p => p.category === 'perifericos').length})
        </button>
        <button
          onClick={() => setSelectedCategory('componentes')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'componentes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔧 Componentes ({products.filter(p => p.category === 'componentes').length})
        </button>
        <button
          onClick={() => setSelectedCategory('consoles')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'consoles' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎮 Consoles ({products.filter(p => p.category === 'consoles').length})
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} produtos
          {selectedCategory && ` na categoria ${selectedCategory}`}
        </p>
      </div>
      
      {/* Products Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            <div className="relative">
              <Link to={`/products/${product.id}`} className="relative block">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Fora de Estoque</span>
                  </div>
                )}
              </Link>
              
              {/* 360° View Button */}
              <button
                onClick={() => handle360View(product)}
                className="absolute top-2 left-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                title="Visualização 360°"
              >
                <span className="text-lg">🔄</span>
              </button>

              {/* Brand Badge */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                {product.brand}
              </div>
            </div>
            
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h2 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h2>
              </Link>
              
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({product.rating}) • {product.reviews} avaliações</span>
              </div>
              
              <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  {product.discount ? (
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice?.toLocaleString('pt-MZ')} MT
                      </span>
                      <span className="block text-lg font-bold text-blue-600">
                        {product.price.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-blue-600">
                      {product.price.toLocaleString('pt-MZ')} MT
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? `${product.stockQuantity} em estoque` : 'Indisponível'}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Removido botão Comprar */}
              <div className="space-y-2">
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full ${
                    product.inStock 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white px-3 py-3 rounded transition-colors text-sm font-medium`}
                  whileHover={product.inStock ? { scale: 1.02 } : {}}
                  whileTap={product.inStock ? { scale: 0.98 } : {}}
                  disabled={!product.inStock}
                >
                  🛒 {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </motion.button>
                
                <Link
                  to={`/products/${product.id}`}
                  className="block w-full text-center bg-blue-600 text-white px-3 py-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  👁️ Ver Detalhes
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos</p>
        </div>
      )}

      {/* Modals */}
      {show360Viewer && selected360Product && (
        <Product360Viewer
          productId={selected360Product.id}
          productName={selected360Product.name}
          images={selected360Product.images}
          onClose={() => setShow360Viewer(false)}
        />
      )}
    </div>
  );
};

export default Products;