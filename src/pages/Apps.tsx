
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AppModuleProps {
  icon: string;
  color: string;
  title: string;
  description: string;
}

const AppModule = ({ icon, color, title, description }: AppModuleProps) => (
  <div className="flex items-start space-x-3 mb-6">
    <div 
      className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-odoo-dark">{title}</h3>
      <p className="text-sm text-odoo-gray">{description}</p>
    </div>
  </div>
);

const Apps = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLandingPage={true} />
      
      <main className="flex-1 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold italic text-center mb-16">One need, one app.</h1>
          
          {/* Website Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold italic mb-8">Website</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AppModule 
                icon="🌐" 
                color="#28BDBE" 
                title="Website" 
                description="Create stunning websites with our drag & drop builder" 
              />
              <AppModule 
                icon="🛍️" 
                color="#875A7B" 
                title="eCommerce" 
                description="Sell your products online with a fully featured store" 
              />
              <AppModule 
                icon="📝" 
                color="#5D8DA8" 
                title="Blog" 
                description="Publish content and grow your online presence" 
              />
              <AppModule 
                icon="💬" 
                color="#32A350" 
                title="Forum" 
                description="Build a community around your brand" 
              />
              <AppModule 
                icon="🎓" 
                color="#3461AA" 
                title="eLearning" 
                description="Create and sell online courses" 
              />
              <AppModule 
                icon="💻" 
                color="#8F4B99" 
                title="Live Chat" 
                description="Connect with your visitors in real-time" 
              />
            </div>
          </section>
          
          {/* Sales Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold italic mb-8">Sales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AppModule 
                icon="🔰" 
                color="#00A09D" 
                title="CRM" 
                description="Boost your sales with lead automation" 
              />
              <AppModule 
                icon="📊" 
                color="#D5653E" 
                title="Sales" 
                description="From quotation to invoice" 
              />
              <AppModule 
                icon="🛒" 
                color="#5D8DA8" 
                title="Point of Sale" 
                description="Modern point of sale for retailers" 
              />
              <AppModule 
                icon="🔄" 
                color="#54B948" 
                title="Subscriptions" 
                description="Manage recurring billing efficiently" 
              />
              <AppModule 
                icon="🏠" 
                color="#8F4B99" 
                title="Rental" 
                description="Rent products and manage your rental business" 
              />
            </div>
          </section>
          
          {/* Finance Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold italic mb-8">Finance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AppModule 
                icon="📝" 
                color="#54B948" 
                title="Accounting" 
                description="Manage your finances and automate accounting" 
              />
              <AppModule 
                icon="💰" 
                color="#28BDBE" 
                title="Invoicing" 
                description="Create and send professional invoices" 
              />
              <AppModule 
                icon="💸" 
                color="#5D8DA8" 
                title="Expenses" 
                description="Streamline employee expense reporting" 
              />
              <AppModule 
                icon="📄" 
                color="#3461AA" 
                title="Documents" 
                description="Organize, share, and secure documents" 
              />
              <AppModule 
                icon="📊" 
                color="#D5653E" 
                title="Spreadsheets" 
                description="Collaborative spreadsheets integrated with your data" 
              />
              <AppModule 
                icon="✍️" 
                color="#00A09D" 
                title="Sign" 
                description="Electronic signatures for your documents" 
              />
            </div>
          </section>
          
          {/* Inventory & Manufacturing Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold italic mb-8">Inventory & Manufacturing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AppModule 
                icon="📦" 
                color="#2C8397" 
                title="Inventory" 
                description="Track stock levels and optimize logistics" 
              />
              <AppModule 
                icon="🔧" 
                color="#D5653E" 
                title="Manufacturing" 
                description="Plan, track and optimize your production" 
              />
              <AppModule 
                icon="📋" 
                color="#8F4B99" 
                title="PLM" 
                description="Manage your product lifecycle" 
              />
              <AppModule 
                icon="🛒" 
                color="#3461AA" 
                title="Purchase" 
                description="Keep track of suppliers and purchases" 
              />
              <AppModule 
                icon="🔧" 
                color="#32A350" 
                title="Maintenance" 
                description="Track equipment maintenance efficiently" 
              />
              <AppModule 
                icon="✓" 
                color="#5D8DA8" 
                title="Quality" 
                description="Quality control for manufacturing processes" 
              />
            </div>
          </section>
          
          {/* Call to Action */}
          <div className="text-center mt-20 mb-16">
            <h2 className="text-4xl font-bold italic mb-4">
              Unleash<br />
              your <span className="text-odoo-primary">growth potential</span>
            </h2>
            <div className="mt-8">
              <Link to="/signup">
                <Button className="bg-odoo-secondary hover:bg-odoo-secondary/90 text-white font-medium py-3 px-8 text-lg">
                  Start now - It's free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Apps;
