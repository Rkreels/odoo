
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-odoo-dark mb-6 italic">
          Enterprise software<br />done right
        </h2>
        <p className="text-xl text-odoo-gray mb-12 max-w-3xl mx-auto">
          Our open source model and modular approach means you start with just what you need and add to it as you go.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-odoo-light p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-odoo-dark mb-4">Easy to use</h3>
            <p className="text-odoo-gray">
              Clean and intuitive interface, with guided flows for optimal usability and productivity.
            </p>
          </div>
          
          <div className="bg-odoo-light p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-odoo-dark mb-4">Fully integrated</h3>
            <p className="text-odoo-gray">
              Each application seamlessly integrates with the others to give you a coherent business platform.
            </p>
          </div>
          
          <div className="bg-odoo-light p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-odoo-dark mb-4">Customizable</h3>
            <p className="text-odoo-gray">
              Tailor the platform to your specific needs with easy configuration and development options.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup">
            <Button className="w-full sm:w-auto bg-odoo-secondary text-white hover:bg-odoo-secondary/90 font-medium py-3 px-6 text-lg">
              Start your free trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="w-full sm:w-auto border-odoo-primary text-odoo-primary hover:bg-odoo-light font-medium py-3 px-6 text-lg">
              Contact sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
