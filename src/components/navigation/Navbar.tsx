
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, Bell, User } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
  isLandingPage?: boolean;
}

const Navbar = ({ isAuthenticated = false, isLandingPage = false }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`w-full ${isLandingPage ? 'bg-white' : 'bg-odoo-primary'} shadow-md z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="https://www.odoo.com/web/image/website/1/logo/Odoo?unique=af51af9"
                  alt="Odoo Logo"
                />
                <span className={`ml-2 font-bold text-xl ${isLandingPage ? 'text-odoo-primary' : 'text-white'}`}>
                  OdooEcho
                </span>
              </Link>
            </div>
            
            {isLandingPage && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/features" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-odoo-dark hover:text-odoo-primary">
                  Features
                </Link>
                <Link to="/pricing" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-odoo-dark hover:text-odoo-primary">
                  Pricing
                </Link>
                <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-odoo-dark hover:text-odoo-primary">
                  About
                </Link>
                <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-odoo-dark hover:text-odoo-primary">
                  Contact
                </Link>
              </div>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <input
                    className="bg-odoo-primary/80 block w-full pl-10 pr-3 py-2 border border-white/30 rounded-md leading-5 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-odoo-dark"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
              <button className="ml-3 p-1 rounded-full text-white hover:bg-odoo-primary/80 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <button className="ml-3 p-1 rounded-full text-white hover:bg-odoo-primary/80 focus:outline-none">
                <User className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              {isLandingPage ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="mr-2">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="text-white hover:text-white/80">
                  Sign in
                </Link>
              )}
            </div>
          )}
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isLandingPage ? 'text-odoo-dark' : 'text-white'} hover:bg-opacity-50 focus:outline-none`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {isLandingPage && (
              <>
                <Link to="/features" className="block pl-3 pr-4 py-2 text-base font-medium text-odoo-dark hover:bg-odoo-light">
                  Features
                </Link>
                <Link to="/pricing" className="block pl-3 pr-4 py-2 text-base font-medium text-odoo-dark hover:bg-odoo-light">
                  Pricing
                </Link>
                <Link to="/about" className="block pl-3 pr-4 py-2 text-base font-medium text-odoo-dark hover:bg-odoo-light">
                  About
                </Link>
                <Link to="/contact" className="block pl-3 pr-4 py-2 text-base font-medium text-odoo-dark hover:bg-odoo-light">
                  Contact
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 text-odoo-primary" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">Account</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
