
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-white py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-odoo-dark leading-tight">
              All-in-One Business Management Software
            </h1>
            <p className="mt-6 text-lg text-odoo-gray max-w-2xl">
              OdooEcho is your complete business solution with integrated apps for CRM, 
              inventory, accounting, HR, e-commerce and more. All your data in one place, 
              accessible from anywhere.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto bg-odoo-primary hover:bg-odoo-primary/90 text-white font-medium py-3 px-6">
                  Start your free trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="w-full sm:w-auto border-odoo-primary text-odoo-primary hover:bg-odoo-primary hover:text-white font-medium py-3 px-6">
                  Watch demo
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <p className="text-odoo-gray text-sm">
                No credit card required · Cancel anytime · Free training included
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <img 
              src="https://www.odoo.com/web/image/website.s_banner_default_image" 
              alt="OdooEcho Dashboard Preview" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
