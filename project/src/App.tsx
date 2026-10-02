import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Routes, Route, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { useUserStore } from './stores/userStore';
import Home from './pages/Home';
import Footer from './components/Footer';
import Header from './components/layout/Header';
import { LEGACY_CATEGORY_PATHS, getProductById, productPath } from './lib/catalog';

// Route-level code splitting: only the homepage ships in the first bundle.
const ShopLayout = lazy(() => import('./components/shop/ShopLayout'));
const Shop = lazy(() => import('./pages/Shop'));
const ShopCategory = lazy(() => import('./pages/ShopCategory'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./components/About'));
const Academy = lazy(() => import('./pages/Academy'));
const Blog = lazy(() => import('./pages/Blog'));
const AIRecommendation = lazy(() => import('./components/AIRecommendation'));
const UserRegistration = lazy(() => import('./components/UserRegistration'));
const UserProfile = lazy(() => import('./components/UserProfile'));

const isShopPath = (pathname: string) => pathname.startsWith('/loja') || pathname.startsWith('/produto/');

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    if (hash) {
      // Wait a frame so the target section exists when arriving from another route.
      const frame = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
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

const PageFallback = () => <div className="min-h-[60vh]" aria-busy="true" />;

function App() {
  const { currentUser } = useUserStore();
  const { pathname } = useLocation();
  // The homepage hero sits under the floating header; every other page starts below it.
  const isHome = pathname === '/';
  const [showRegistration, setShowRegistration] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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

        <Header onSignIn={() => setShowRegistration(true)} onOpenProfile={() => setShowProfile(true)} />

        <main id="conteudo" className={`flex-grow ${isHome ? '' : 'pt-24'}`}>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<ShopLayout />}>
                <Route path="/loja" element={<Shop />} />
                <Route path="/loja/:category/:subcategory?" element={<ShopCategory />} />
                <Route path="/produto/:slug" element={<ProductPage />} />
              </Route>
              <Route path="/products" element={<LegacyProducts />} />
              <Route path="/products/:id" element={<LegacyProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:postId" element={<Blog />} />
              <Route path="/ai-recommendation" element={<AIRecommendation />} />
            </Routes>
          </Suspense>
        </main>

        <Suspense fallback={null}>
          {showRegistration && (
            <UserRegistration
              onClose={() => setShowRegistration(false)}
              onSuccess={() => setShowRegistration(false)}
            />
          )}
          {showProfile && currentUser && <UserProfile onClose={() => setShowProfile(false)} />}
        </Suspense>

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
