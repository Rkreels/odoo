
import { Link } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import ModulesDisplay from '@/components/landing/ModulesDisplay';
import Testimonials from '@/components/landing/Testimonials';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLandingPage={true} />
      <Hero />
      <ModulesDisplay />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
