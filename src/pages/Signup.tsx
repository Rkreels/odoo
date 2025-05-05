
import Navbar from '@/components/navigation/Navbar';
import SignupForm from '@/components/auth/SignupForm';
import Footer from '@/components/landing/Footer';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLandingPage={true} />
      <div className="flex-1 flex items-center justify-center bg-odoo-light py-12 px-4 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
