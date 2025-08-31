import { useCartStore } from '../stores/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCartStore();

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.custom((_t) => (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3"
      >
        <span className="text-2xl">🗑️</span>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm opacity-90">Removido do carrinho</p>
        </div>
      </motion.div>
    ));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
    
    toast.custom((_t) => (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg flex items-center gap-2"
      >
        <span>🔄</span>
        <span>Quantidade atualizada</span>
      </motion.div>
    ), { duration: 1500 });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div 
            className="text-8xl mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🛒
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-300 mb-8 text-lg">Explore nossos produtos incríveis e adicione itens ao seu carrinho</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/products" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg"
            >
              🛍️ Explorar Produtos
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🛒
            </motion.span>
            Seu Carrinho
          </h1>
          <p className="text-xl text-gray-300">
            {items.length} {items.length === 1 ? 'item' : 'itens'} selecionados
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📦</span> Itens do Carrinho
                </h2>
              </div>
              
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0, y: 20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-700 last:border-b-0"
                  >
                    <div className="p-6 flex items-center gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        <Link to={`/products/${item.id}`}>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-24 h-24 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                          />
                        </Link>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.quantity}x
                        </div>
                      </motion.div>
                      
                      <div className="flex-1">
                        <Link to={`/products/${item.id}`}>
                          <h3 className="font-semibold text-xl text-white hover:text-cyan-400 transition-colors mb-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-cyan-400 font-bold text-2xl mb-4">
                          {item.price.toLocaleString('pt-MZ')} MT
                        </p>
                        
                        <div className="flex items-center gap-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-2">
                            <motion.button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center font-bold"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              −
                            </motion.button>
                            <span className="w-12 text-center font-bold text-white text-lg">{item.quantity}</span>
                            <motion.button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center font-bold"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                          
                          {/* Remove Button */}
                          <motion.button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>🗑️</span>
                            Remover
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <motion.p 
                          className="font-bold text-2xl text-green-400 mb-2"
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                        >
                          {(item.price * item.quantity).toLocaleString('pt-MZ')} MT
                        </motion.p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 sticky top-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>💰</span> Resumo do Pedido
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Items Summary */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-300">
                      <span>{item.name.substring(0, 20)}... x{item.quantity}</span>
                      <span className="font-medium">{(item.price * item.quantity).toLocaleString('pt-MZ')} MT</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Subtotal</span>
                    <span>{total.toLocaleString('pt-MZ')} MT</span>
                  </div>
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Taxa de entrega</span>
                    <span className="text-green-400">Grátis</span>
                  </div>
                  <div className="flex justify-between text-gray-300 mb-4">
                    <span>Impostos</span>
                    <span>Inclusos</span>
                  </div>
                  
                  <motion.div 
                    className="flex justify-between font-bold text-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>Total</span>
                    <span>{total.toLocaleString('pt-MZ')} MT</span>
                  </motion.div>
                </div>
                
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/checkout"
                      className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center px-6 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg"
                    >
                      🚀 Finalizar Compra
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/products"
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      🛍️ Continuar Comprando
                    </Link>
                  </motion.div>
                </div>
                
                {/* Security Badge */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <span>🔒</span>
                    <span className="font-medium">Compra 100% Segura</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Seus dados são protegidos com criptografia SSL
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;