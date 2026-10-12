
import { useEffect } from 'react';

import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Collection from './components/Collection/Collection';
import Experience from './components/Experience/Experience';
import About from './components/About/About';
import Footer from './components/Footer/Footer';

import ProductDetails from './pages/ProductDetails/ProductDetails';

// ==========================================
// SCROLL MANAGEMENT
// ==========================================

function ScrollToSection() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));

    const frame = requestAnimationFrame(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

// ==========================================
// HOME PAGE
// ==========================================

function HomePage() {
  return (
    <main>
      <Hero />
      <Collection />
      <Experience />
      <About />
    </main>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================

function App() {
  return (
    <>
      <ScrollToSection />

      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/product/:productId"
          element={<ProductDetails />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
