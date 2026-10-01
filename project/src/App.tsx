import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { useUserStore } from './stores/userStore';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import About from './components/About';
import Academy from './pages/Academy';
import AIRecommendation from './components/AIRecommendation';
import Footer from './components/Footer';
import Header from './components/layout/Header';
import UserRegistration from './components/UserRegistration';
import UserProfile from './components/UserProfile';
import Blog from './pages/Blog';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so the target section exists when arriving from another route.
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/ai-recommendation" element={<AIRecommendation />} />
          </Routes>
        </main>

        {showRegistration && (
          <UserRegistration
            onClose={() => setShowRegistration(false)}
            onSuccess={() => setShowRegistration(false)}
          />
        )}

        {showProfile && currentUser && <UserProfile onClose={() => setShowProfile(false)} />}

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
