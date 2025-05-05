
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-odoo-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to streamline your business operations?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Join thousands of businesses that use OdooEcho to manage their operations, 
          increase productivity, and drive growth.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup">
            <Button className="w-full sm:w-auto bg-white text-odoo-primary hover:bg-white/90 font-medium py-3 px-6 text-lg">
              Start your free trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-medium py-3 px-6 text-lg">
              Contact sales
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-white/80">
          No credit card required · 15-day free trial · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
