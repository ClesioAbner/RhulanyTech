import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import ShopToPayments from '../components/home/ShopToPayments';
import Services from '../components/home/Services';
import StoreVisit from '../components/home/StoreVisit';
import Manifesto from '../components/home/Manifesto';

const Home = () => (
  <>
    <Hero />
    <Manifesto />
    <CategoryGrid />
    <ShopToPayments />
    <Services />
    <StoreVisit />
  </>
);

export default Home;
