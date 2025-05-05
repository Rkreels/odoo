
import { Link } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import LoginForm from '@/components/auth/LoginForm';
import Footer from '@/components/landing/Footer';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLandingPage={true} />
      <div className="flex-1 flex items-center justify-center bg-odoo-light py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
