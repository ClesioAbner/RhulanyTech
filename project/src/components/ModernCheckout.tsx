import React, { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ModernPayment from './ModernPayment';
import EnhancedReceipt from './EnhancedReceipt';

interface CheckoutData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  shippingAddress: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    province: string;
    zipCode: string;
  };
  paymentMethod: string;
  notes: string;
}

const ModernCheckout = () => {
  const { items, total, clearCart, getItemCount } = useCartStore();
  const { currentUser, addPurchase } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    personalInfo: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      document: ''
    },
    shippingAddress: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: 'Maputo',
      province: 'Maputo',
      zipCode: ''
    },
    paymentMethod: '',
    notes: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const provinces = [
    'Maputo', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 
    'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'
  ];

  const paymentMethods = [
    { id: 'mpesa', name: 'M-Pesa Vodacom', icon: '📱' },
    { id: 'emola', name: 'E-mola Millennium', icon: '💳' },
    { id: 'stripe', name: 'Cartão de Crédito/Débito', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'bitcoin', name: 'Bitcoin', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'bank', name: 'Transferência Bancária', icon: '🏦' }
  ];

  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: '👤' },
    { id: 2, title: 'Endereço de Entrega', icon: '📍' },
    { id: 3, title: 'Confirmar Pagamento', icon: '💳' }
  ];

  const handleInputChange = (section: keyof CheckoutData, field: string, value: string | boolean) => {
    setCheckoutData(prev => {
      if (section === 'personalInfo' || section === 'shippingAddress') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      } else {
        // For primitive types like paymentMethod and notes
        return {
          ...prev,
          [section]: value
        };
      }
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const { name, email, phone, document } = checkoutData.personalInfo;
        if (!name || !email || !phone || !document) {
          toast.error('❌ Preencha todos os campos obrigatórios');
          return false;
        }
        if (!email.includes('@')) {
          toast.error('❌ Email inválido');
          return false;
        }
        return true;
      
      case 2:
        const { street, number, neighborhood, city, zipCode } = checkoutData.shippingAddress;
        if (!street || !number || !neighborhood || !city || !zipCode) {
          toast.error('❌ Preencha todos os campos do endereço');
          return false;
        }
        return true;
      
      case 3:
        if (!checkoutData.paymentMethod) {
          toast.error('❌ Selecione um método de pagamento');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // Ir direto para o pagamento
        setShowPayment(true);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 3));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotal = () => {
    return total; // Sem taxa de entrega
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const orderNumber = `RT${Date.now().toString().slice(-8)}`;
    const newOrder = {
      id: orderNumber,
      orderNumber,
      date: new Date(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: calculateTotal(),
      customerInfo: checkoutData.personalInfo,
      shippingAddress: checkoutData.shippingAddress,
      shippingMethod: 'standard',
      paymentData
    };

    // Create a PurchaseRecord object that conforms to the interface
    const purchaseRecord = {
      id: orderNumber,
      orderNumber,
      date: new Date(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total: calculateTotal(),
      paymentMethod: checkoutData.paymentMethod,
      status: 'confirmed' as const
    };

    setOrderData(newOrder);
    
    if (currentUser) {
      addPurchase(purchaseRecord);
    }
    
    clearCart();
    setShowPayment(false);
    setShowReceipt(true);
    
    toast.success('🎉 Pedido realizado com sucesso!');
  };

  if (items.length === 0 && !showReceipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Carrinho Vazio</h2>
          <p className="text-gray-300 mb-8 text-lg">Adicione produtos ao carrinho para continuar</p>
          <Link 
            to="/products" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-semibold text-lg"
          >
            🛍️ Explorar Produtos
          </Link>
        </motion.div>
      </div>
    );
  }

  if (showReceipt && orderData) {
    return (
      <EnhancedReceipt
        orderData={orderData}
        onClose={() => setShowReceipt(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
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
            Finalizar Compra
          </h1>
          <p className="text-xl text-gray-300">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'} • {calculateTotal().toLocaleString('pt-MZ')} MT
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <motion.div
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                    animate={{ scale: currentStep === step.id ? 1.05 : 1 }}
                  >
                    <span className="text-2xl">{step.icon}</span>
                    <div className="hidden md:block">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">Passo {step.id}</div>
                    </div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 rounded ${
                      currentStep > step.id ? 'bg-blue-500' : 'bg-gray-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>👤</span> Informações Pessoais
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.personalInfo.name}
                          onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="João Silva"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={checkoutData.personalInfo.email}
                          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="joao@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={checkoutData.personalInfo.phone}
                          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="+258 87 959 6862"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Documento de Identidade *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.personalInfo.document}
                          onChange={(e) => handleInputChange('personalInfo', 'document', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="BI ou Passaporte"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>📍</span> Endereço de Entrega
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Rua/Avenida *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.street}
                          onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Av. Julius Nyerere"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Número *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.number}
                          onChange={(e) => handleInputChange('shippingAddress', 'number', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="123"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.complement}
                          onChange={(e) => handleInputChange('shippingAddress', 'complement', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Apartamento, andar, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Bairro *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.neighborhood}
                          onChange={(e) => handleInputChange('shippingAddress', 'neighborhood', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Polana"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.city}
                          onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Maputo"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Província *
                        </label>
                        <select
                          value={checkoutData.shippingAddress.province}
                          onChange={(e) => handleInputChange('shippingAddress', 'province', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                          required
                        >
                          {provinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          value={checkoutData.shippingAddress.zipCode}
                          onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="1100"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <span>💳</span> Método de Pagamento
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Escolha como deseja pagar:
                        </label>
                        <select
                          value={checkoutData.paymentMethod}
                          onChange={(e) => handleInputChange('paymentMethod', '', e.target.value)}
                          className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-lg"
                          required
                        >
                          <option value="">Selecione um método de pagamento</option>
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.icon} {method.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {checkoutData.paymentMethod && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-blue-500/30"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">
                              {paymentMethods.find(m => m.id === checkoutData.paymentMethod)?.icon}
                            </span>
                            <div>
                              <h3 className="font-semibold text-white text-lg">
                                {paymentMethods.find(m => m.id === checkoutData.paymentMethod)?.name}
                              </h3>
                              <p className="text-blue-200 text-sm">Método selecionado</p>
                            </div>
                          </div>
                          <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-white font-medium">
                              💰 Valor Total: {calculateTotal().toLocaleString('pt-MZ')} MT
                            </p>
                            <p className="text-blue-200 text-sm mt-1">
                              ✅ Pagamento seguro e criptografado
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={checkoutData.notes}
                          onChange={(e) => handleInputChange('notes', '', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Instruções especiais para entrega..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <motion.button
                    onClick={prevStep}
                    className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← Voltar
                  </motion.button>
                )}
                
                <motion.button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep === 3 ? '✅ Confirmar Pagamento' : 'Próximo →'}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 sticky top-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>💰</span> Resumo do Pedido
              </h3>
              
              <div className="space-y-4">
                {/* Items Summary */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{item.name}</h4>
                        <p className="text-gray-400 text-xs">
                          {item.quantity}x • {item.price.toLocaleString('pt-MZ')} MT
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400 text-sm">
                          {(item.price * item.quantity).toLocaleString('pt-MZ')} MT
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Subtotal ({getItemCount()} itens)</span>
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
                    <span>{calculateTotal().toLocaleString('pt-MZ')} MT</span>
                  </motion.div>
                </div>
                
                <div className="space-y-3">
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

      {/* Payment Modal */}
      {showPayment && (
        <ModernPayment
          amount={calculateTotal()}
          orderData={{
            items,
            customerInfo: checkoutData.personalInfo,
            shippingAddress: checkoutData.shippingAddress,
            notes: checkoutData.notes
          }}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default ModernCheckout;
