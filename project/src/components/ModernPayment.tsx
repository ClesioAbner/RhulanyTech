import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface ModernPaymentProps {
  amount: number;
  orderData: any;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

const ModernPayment: React.FC<ModernPaymentProps> = ({
  amount,

  onSuccess,
  onCancel
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mobileNumber: '',
  });
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: '📱',
      color: 'from-green-500 to-emerald-500',
      description: 'Pagamento via M-Pesa Vodacom'
    },
    {
      id: 'emola',
      name: 'E-mola',
      icon: '💳',
      color: 'from-blue-500 to-cyan-500',
      description: 'Transferência via E-mola'
    },
    {
      id: 'stripe',
      name: 'Cartão de Crédito',
      icon: '💳',
      color: 'from-purple-500 to-indigo-500',
      description: 'Visa, Mastercard'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      color: 'from-blue-600 to-blue-700',
      description: 'Pagamento seguro PayPal'
    }
  ];

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionData = {
        transactionId: `${selectedMethod}_${Date.now()}`,
        amount,
        method: selectedMethod,
        status: 'completed',
        timestamp: new Date().toISOString()
      };

      toast.custom(() => (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            ✅
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">Pagamento Aprovado!</h3>
            <p className="text-sm opacity-90">
              {amount.toLocaleString('pt-MZ')} MT processado
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });

      onSuccess(transactionData);
    } catch (error) {
      toast.error('❌ Erro no pagamento. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    if (selectedMethod === 'mpesa' || selectedMethod === 'emola') {
      return (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de Telefone
            </label>
            <input
              type="tel"
              value={paymentData.mobileNumber}
              onChange={(e) => setPaymentData(prev => ({ ...prev, mobileNumber: e.target.value }))}
              placeholder="+258 87 959 6862"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
        </motion.div>
      );
    }

    if (selectedMethod === 'stripe') {
      return (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            value={paymentData.cardName}
            onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
            placeholder="Nome no Cartão"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
          <input
            type="text"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
              placeholder="MM/AA"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <input
              type="text"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
              placeholder="123"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        className={`bg-gradient-to-r ${method.color} p-6 rounded-xl text-white text-center`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl mb-4">{method.icon}</div>
        <h4 className="font-medium text-lg mb-3">Redirecionamento para {method.name}</h4>
        <p className="text-sm opacity-90">
          Você será redirecionado para completar o pagamento.
        </p>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-lg w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">💳 Pagamento</h2>
          <p className="text-gray-300">
            Total: <span className="font-bold text-green-400">{amount.toLocaleString('pt-MZ')} MT</span>
          </p>
        </div>

        {!selectedMethod ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-white mb-4">Escolha o método:</h3>
            {paymentMethods.map((method, index) => (
              <motion.button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300 transition-all text-left`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{method.icon}</span>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedMethod('')}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700"
              >
                ← Voltar
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                </span>
                <span className="font-medium text-white">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </span>
              </div>
            </div>

            {renderPaymentForm()}

            <motion.button
              onClick={processPayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl hover:shadow-lg transition-all disabled:bg-gray-600 flex items-center justify-center gap-2 font-semibold text-lg"
              whileHover={!processing ? { scale: 1.02 } : {}}
            >
              {processing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processando...
                </>
              ) : (
                <>
                  <span>🔐</span>
                  Processar Pagamento
                </>
              )}
            </motion.button>
          </div>
        )}

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ModernPayment;
