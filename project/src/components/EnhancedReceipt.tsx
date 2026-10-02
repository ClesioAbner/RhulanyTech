import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

interface EnhancedReceiptProps {
  orderData: {
    orderNumber: string;
    date: Date;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }>;
    total: number;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      province: string;
      zipCode: string;
    };
    shippingMethod: string;
    paymentData: any;
  };
  onClose: () => void;
}

const EnhancedReceipt: React.FC<EnhancedReceiptProps> = ({ orderData, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Generate QR Code for order tracking
    const generateQRCode = async () => {
      try {
        const trackingUrl = `https://rhulanytech.co.mz/track/${orderData.orderNumber}`;
        const qrUrl = await QRCode.toDataURL(trackingUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();

    // Simulate email sending
    const sendEmailNotification = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setEmailSent(true);
        
        toast.custom((_t) => (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              📧
            </motion.div>
            <div>
              <h3 className="font-bold text-lg">Email Enviado!</h3>
              <p className="text-sm opacity-90">
                Recibo enviado para {orderData.customerInfo.email}
              </p>
            </div>
          </motion.div>
        ), { duration: 4000 });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    sendEmailNotification();
  }, [orderData.orderNumber, orderData.customerInfo.email]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const receipt = document.getElementById('enhanced-receipt');
      if (receipt) {
        // Hide buttons before capturing
        const buttons = receipt.querySelectorAll('.no-print');
        buttons.forEach(button => {
          (button as HTMLElement).style.display = 'none';
        });

        const canvas = await html2canvas(receipt, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: receipt.scrollWidth || 800,
          height: receipt.scrollHeight || 1200
        });
        
        // Show buttons again
        buttons.forEach(button => {
          (button as HTMLElement).style.display = '';
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`recibo-rhulany-tech-${orderData.orderNumber}.pdf`);
        
        toast.custom((_t) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <span className="text-2xl">📥</span>
            <div>
              <p className="font-medium">PDF Baixado!</p>
              <p className="text-sm opacity-90">Recibo salvo com sucesso</p>
            </div>
          </motion.div>
        ), { duration: 3000 });
      }
    } catch (error) {
      toast.error('❌ Erro ao gerar PDF. Tente novamente.');
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'mpesa': 'M-Pesa Vodacom',
      'emola': 'E-mola Millennium',
      'stripe': 'Cartão de Crédito/Débito',
      'paypal': 'PayPal',
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'bank': 'Transferência Bancária'
    };
    return methods[method] || method;
  };

  const getShippingMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'standard': 'Entrega Padrão (5-7 dias)',
      'express': 'Entrega Expressa (2-3 dias)',
      'premium': 'Entrega Premium (24-48h)',
      'pickup': 'Retirada na Loja'
    };
    return methods[method] || method;
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.17; // 17% IVA
  const shipping = orderData.shippingMethod === 'pickup' ? 0 : 
                   orderData.shippingMethod === 'standard' ? 5000 :
                   orderData.shippingMethod === 'express' ? 12000 : 25000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div id="enhanced-receipt" className="bg-white">
          {/* Header with Enhanced Logo */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div 
                  className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-3xl font-bold">RT</span>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Rhulany Tech</h1>
                  <p className="text-blue-100 text-lg">Tecnologia de Ponta em Moçambique</p>
                  <p className="text-blue-200 text-sm">Inovação • Qualidade • Confiança</p>
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-6xl mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🧾
                </motion.div>
                <p className="text-blue-100 font-bold text-lg">Recibo Oficial</p>
                <p className="text-blue-200 text-sm">Documento Fiscal</p>
              </div>
            </div>
          </div>

          {/* Company Info Enhanced */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-medium text-gray-800">Endereço</p>
                  <p>Urbanização, Maputo - Moçambique</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <p className="font-medium text-gray-800">Telefone</p>
                  <p>+258 87 959 6862</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p>info@rhulanytech.co.mz</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <p className="font-medium text-gray-800">Website</p>
                  <p>www.rhulanytech.co.mz</p>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Details Enhanced */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Order Details */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Detalhes do Pedido
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número do Pedido:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">#{orderData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data do Pedido:</span>
                    <span className="font-semibold">{new Date(orderData.date).toLocaleDateString('pt-MZ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                      <span>✅</span> Confirmado
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Entrega:</span>
                    <span className="font-semibold text-purple-600">🚚 {getShippingMethodName(orderData.shippingMethod)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg">
                <h3 className="font-bold text-xl text-green-800 mb-4 flex items-center gap-2">
                  <span>👤</span> Dados do Cliente
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Nome:</span>
                    <p className="font-semibold text-gray-800">{orderData.customerInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold text-gray-800">{orderData.customerInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Telefone:</span>
                    <p className="font-semibold text-gray-800">{orderData.customerInfo.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Endereço:</span>
                    <p className="font-semibold text-gray-800">
                      {orderData.shippingAddress.street}, {orderData.shippingAddress.number}<br/>
                      {orderData.shippingAddress.neighborhood}<br/>
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.province}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code & Tracking */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 shadow-lg text-center">
                <h3 className="font-bold text-xl text-purple-800 mb-4 flex items-center justify-center gap-2">
                  <span>📱</span> Rastreamento
                </h3>
                {qrCodeUrl && (
                  <div className="mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto rounded-lg shadow-md" />
                    <p className="text-sm text-gray-600 mt-2">Escaneie para rastrear seu pedido</p>
                  </div>
                )}
                <div className="bg-purple-100 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Código de Rastreamento
                  </p>
                  <p className="font-mono text-sm font-bold text-purple-800">RT-{orderData.orderNumber}</p>
                </div>
              </div>
            </div>

            {/* Payment Method Enhanced */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 mb-8 shadow-lg">
              <h3 className="font-bold text-xl text-yellow-800 mb-4 flex items-center gap-2">
                <span>💳</span> 
                Método de Pagamento
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                  💳
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-800">{getPaymentMethodName(orderData.paymentData.method)}</p>
                  {orderData.paymentData.transactionId && (
                    <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block mt-1">
                      ID: {orderData.paymentData.transactionId.slice(-12)}
                    </p>
                  )}
                  <p className="text-sm text-green-600 font-medium mt-1">✅ Pagamento Confirmado</p>
                </div>
              </div>
            </div>

            {/* Items Enhanced */}
            <div className="mb-8">
              <h3 className="font-bold text-2xl mb-6 flex items-center gap-2 text-gray-800">
                <span>🛍️</span> Itens do Pedido
              </h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-6 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-xl shadow-lg" 
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.quantity}x
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h4>
                      <div className="grid grid-cols-3 gap-6 text-sm">
                        <div className="bg-white p-3 rounded-lg border">
                          <span className="text-gray-600 block">Quantidade:</span>
                          <p className="font-bold text-blue-600">{item.quantity} unidades</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <span className="text-gray-600 block">Preço unitário:</span>
                          <p className="font-bold text-green-600">{item.price.toLocaleString('pt-MZ')} MT</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <span className="text-gray-600 block">Subtotal:</span>
                          <p className="font-bold text-purple-600">{(item.price * item.quantity).toLocaleString('pt-MZ')} MT</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Total Calculation */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-white mb-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>💰</span> Resumo Financeiro
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Subtotal ({orderData.items.reduce((sum, item) => sum + item.quantity, 0)} itens):</span>
                  <span className="font-semibold text-xl">{subtotal.toLocaleString('pt-MZ')} MT</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">Taxa de Entrega:</span>
                  <span className="font-semibold text-green-400">
                    {shipping === 0 ? 'Grátis' : `${shipping.toLocaleString('pt-MZ')} MT`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300">IVA (17%):</span>
                  <span className="font-semibold text-xl">{tax.toLocaleString('pt-MZ')} MT</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-2xl font-bold mb-1">Total Pago</h4>
                    <p className="text-green-100 text-sm">Valor final com todos os impostos inclusos</p>
                  </div>
                  <div className="text-right">
                    <motion.div 
                      className="text-4xl font-bold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {orderData.total.toLocaleString('pt-MZ')} MT
                    </motion.div>
                    <p className="text-green-100 text-sm mt-1">
                      {emailSent ? '📧 Recibo enviado por email' : '📧 Enviando recibo...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Enhanced */}
            <div className="text-center space-y-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                <motion.h4 
                  className="font-bold text-green-800 mb-3 flex items-center justify-center gap-2 text-xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span>🙏</span> Obrigado pela sua preferência!
                </motion.h4>
                <p className="text-green-700 text-lg mb-4">
                  Seu pedido será processado em breve. Você receberá atualizações via WhatsApp e email.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <div className="text-2xl mb-2">📦</div>
                    <p className="font-medium text-green-800">Processamento</p>
                    <p className="text-green-600">1-2 dias úteis</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <div className="text-2xl mb-2">🚚</div>
                    <p className="font-medium text-green-800">Entrega</p>
                    <p className="text-green-600">
                      {orderData.shippingMethod === 'pickup' ? 'Disponível hoje' :
                       orderData.shippingMethod === 'standard' ? '5-7 dias úteis' :
                       orderData.shippingMethod === 'express' ? '2-3 dias úteis' : '24-48 horas'}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <div className="text-2xl mb-2">🛡️</div>
                    <p className="font-medium text-green-800">Garantia</p>
                    <p className="text-green-600">12 meses</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <span>📞</span>
                  <span>Suporte: +258 87 959 6862</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <span>⏰</span>
                  <span>Seg-Sáb: 8h às 18h</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <span>🌐</span>
                  <span>www.rhulanytech.co.mz</span>
                </div>
                <div className="flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <span>📧</span>
                  <span>suporte@rhulanytech.co.mz</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
                <motion.button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGeneratingPDF ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <span>📥</span> Baixar Recibo (PDF)
                    </>
                  )}
                </motion.button>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/loja"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg"
                  >
                    <span>🛍️</span> Continuar Comprando
                  </Link>
                </motion.div>

                <motion.button
                  onClick={onClose}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>✕</span> Fechar
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedReceipt;