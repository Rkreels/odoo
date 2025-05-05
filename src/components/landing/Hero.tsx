
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-odoo-dark mb-6 leading-tight">
          All your business on <span className="text-odoo-primary">one platform</span>
        </h1>
        <p className="mt-2 mb-8 text-xl text-odoo-gray max-w-3xl mx-auto">
          Simple, efficient, yet affordable
        </p>
        
        <div className="flex justify-center mb-12">
          <Link to="/signup">
            <Button className="bg-odoo-primary hover:bg-odoo-primary/90 text-white font-medium py-3 px-8 text-lg">
              Start now
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-4 justify-center mt-16 max-w-5xl mx-auto">
          {/* First row of app icons */}
          <AppIcon color="#00A09D" icon="🔰" name="CRM" />
          <AppIcon color="#875A7B" icon="📊" name="Sales" />
          <AppIcon color="#5D8DA8" icon="🛒" name="POS" />
          <AppIcon color="#28BDBE" icon="💰" name="Invoicing" />
          <AppIcon color="#54B948" icon="📝" name="Accounting" />
          <AppIcon color="#2C8397" icon="📦" name="Inventory" />
          <AppIcon color="#D5653E" icon="🔧" name="Manufacturing" />
          <AppIcon color="#3461AA" icon="👥" name="HR" />
          <AppIcon color="#8F4B99" icon="📱" name="Marketing" />
          
          {/* Second row of app icons */}
          <AppIcon color="#32A350" icon="🛠️" name="Services" />
          <AppIcon color="#5EC4CB" icon="🌐" name="Website" />
          <AppIcon color="#D5653E" icon="🛍️" name="eCommerce" />
          <AppIcon color="#28BDBE" icon="📝" name="Documents" />
          <AppIcon color="#545487" icon="📊" name="BI" />
          <AppIcon color="#5D8DA8" icon="🤖" name="IoT" />
          <AppIcon color="#D5653E" icon="📣" name="Email" />
          <AppIcon color="#32A350" icon="✅" name="Projects" />
          <AppIcon color="#8F4B99" icon="📅" name="Planning" />
        </div>
        
        <p className="mt-10 text-odoo-gray text-center max-w-3xl mx-auto">
          OdooEcho offers a suite of open-source business apps that cover all your company needs: CRM, eCommerce, accounting, inventory, point of sale, project management, etc.
        </p>
      </div>
    </div>
  );
};

interface AppIconProps {
  color: string;
  icon: string;
  name: string;
}

const AppIcon = ({ color, icon, name }: AppIconProps) => (
  <div className="flex flex-col items-center">
    <div 
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mb-1"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <span className="text-xs text-odoo-dark">{name}</span>
  </div>
);

export default Hero;
