import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Routes, Route, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Home from './pages/Home';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CartDrawer from './components/cart/CartDrawer';
import PageLoader from './components/ui/PageLoader';
import { LEGACY_CATEGORY_PATHS, getProductById, productPath } from './lib/catalog';

// Route-level code splitting: only the homepage ships in the first bundle.
const ShopLayout = lazy(() => import('./components/shop/ShopLayout'));
const Shop = lazy(() => import('./pages/Shop'));
const ShopCategory = lazy(() => import('./pages/ShopCategory'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Account = lazy(() => import('./pages/Account'));

// Pages that open with a full-screen banner under the floating header.
const FULL_BLEED_PATHS = ['/', '/loja', '/blog', '/sobre', '/contacto', '/entrar'];

const isShopPath = (pathname: string) => pathname.startsWith('/loja') || pathname.startsWith('/produto/');

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    if (hash) {
      // The target can live in a lazily loaded page: keep looking for it for a moment.
      let frame = 0;
      const started = performance.now();
      const find = () => {
        const target = document.getElementById(hash.slice(1));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (performance.now() - started < 2000) frame = requestAnimationFrame(find);
      };
      frame = requestAnimationFrame(find);
      return () => cancelAnimationFrame(frame);
    }
    // Inside the shop, ShopLayout scrolls once the outgoing page has faded, so the jump isn't visible.
    if (isShopPath(from) && isShopPath(pathname)) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

// Old /products links (header, footer, bookmarks) land on the matching new shelf.
const LegacyProducts = () => {
  const [params] = useSearchParams();
  return <Navigate to={LEGACY_CATEGORY_PATHS[params.get('category') ?? ''] ?? '/loja'} replace />;
};

const LegacyProduct = () => {
  const { id } = useParams();
  // Cart items carry the variant in their id ("1:Titânio Deserto:256GB"); the product id comes first.
  const product = getProductById(id?.split(':')[0]);
  return <Navigate to={product ? productPath(product) : '/loja'} replace />;
};

function App() {
  const { pathname } = useLocation();
  // The homepage hero sits under the floating header; every other page starts below it.
  const fullBleed = FULL_BLEED_PATHS.includes(pathname);
  // Sign-in is a focused page: no site header or footer, just the form.
  const focused = pathname === '/entrar';

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Saltar para o conteúdo
        </a>

        {!focused && (
          <div className="print:hidden">
            <Header />
          </div>
        )}

        <main id="conteudo" className={`flex-grow ${fullBleed ? '' : 'pt-24 print:pt-0'}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<ShopLayout />}>
                <Route path="/loja" element={<Shop />} />
                <Route path="/loja/:category/:subcategory?" element={<ShopCategory />} />
                <Route path="/produto/:slug" element={<ProductPage />} />
              </Route>
              <Route path="/products" element={<LegacyProducts />} />
              <Route path="/products/:id" element={<LegacyProduct />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/encomenda/:number" element={<OrderConfirmation />} />
              <Route path="/entrar" element={<SignIn />} />
              <Route path="/conta" element={<Account />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<Navigate to="/sobre" replace />} />
              <Route path="/academy" element={<Navigate to="/blog" replace />} />
            </Routes>
          </Suspense>
        </main>

        {!focused && (
          <div className="print:hidden">
            <Footer />
          </div>
        )}
      </div>
      <CartDrawer />
    </MotionConfig>
  );
}

export default App;
