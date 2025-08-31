import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo size="md" variant="white" animated={true} />
            </div>
            <p className="text-gray-400 mb-4">
              Especialistas em equipamentos gaming e informática de alta performance em Maputo.
            </p>
            <div className="space-y-2">
              <p className="flex items-center text-gray-400">
                <span className="mr-2">📍</span>
                Urbanização, Maputo
              </p>
              <p className="flex items-center text-gray-400">
                <span className="mr-2">📱</span>
                +258 87 959 6862
              </p>
              <p className="flex items-center text-gray-400">
                <span className="mr-2">⏰</span>
                Segunda a Sábado: 8h - 18h
              </p>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0">
            <h3 className="text-xl font-bold mb-4">Produtos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/products?category=computadores" className="hover:text-white transition-colors">
                  Computadores Gaming
                </a>
              </li>
              <li>
                <a href="/products?category=perifericos" className="hover:text-white transition-colors">
                  Periféricos
                </a>
              </li>
              <li>
                <a href="/products?category=componentes" className="hover:text-white transition-colors">
                  Componentes
                </a>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 lg:mt-0">
            <h3 className="text-xl font-bold mb-4">Atendimento</h3>
            <p className="text-gray-400 mb-4">
              Precisa de ajuda? Entre em contato conosco através do WhatsApp ou visite nossa loja.
            </p>
            <a
              href="https://wa.me/258879596862"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mr-2">WhatsApp</span>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2023 Rhulany Tech. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;