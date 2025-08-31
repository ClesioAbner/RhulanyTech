import { useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { products } from '../data/products';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Produto não encontrado</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleWhatsApp = () => {
    const message = `Olá! Estou interessado no produto ${product.name} (${product.price.toLocaleString('pt-MZ')} MT)`;
    window.open(`https://wa.me/258879596862?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {product.price.toLocaleString('pt-MZ')} MT
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Especificações:</h2>
            <ul className="list-disc list-inside space-y-2">
              {product.specs.map((spec, index) => (
                <li key={index} className="text-gray-600">{spec}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar ao Carrinho
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Contactar via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
