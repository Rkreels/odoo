
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModuleProps {
  title: string;
  description: string;
  features: string[];
  image: string;
}

const Module = ({ title, description, features, image }: ModuleProps) => (
  <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="md:w-1/2">
      <h3 className="text-2xl font-bold text-odoo-dark mb-4">{title}</h3>
      <p className="text-odoo-gray mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-odoo-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-odoo-dark">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="md:w-1/2 mt-6 md:mt-0">
      <img src={image} alt={title} className="rounded-lg shadow-md w-full h-auto" />
    </div>
  </div>
);

const AppModules = () => {
  const [activeTab, setActiveTab] = useState('crm');
  
  const modules = [
    {
      id: 'crm',
      title: 'CRM',
      description: 'Boost your sales with a comprehensive CRM system that helps you track leads, opportunities, and customer interactions.',
      features: [
        'Lead and opportunity management',
        'Sales pipeline visualization',
        'Customer communication tracking',
        'Performance analytics and forecasting',
        'Email campaign integration'
      ],
      image: 'https://www.odoo.com/web/image/website.s_image_text_default_image'
    },
    {
      id: 'sales',
      title: 'Sales',
      description: 'Streamline your sales process from quotation to invoice with our integrated sales management system.',
      features: [
        'Quotation and order management',
        'Product configuration',
        'Price management and discounts',
        'Customer portal for self-service',
        'Integration with CRM and inventory'
      ],
      image: 'https://www.odoo.com/web/image/website.s_text_image_default_image'
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Keep track of your stock levels, manage warehouses, and optimize your supply chain with our inventory management system.',
      features: [
        'Real-time inventory tracking',
        'Multi-warehouse management',
        'Automated replenishment',
        'Barcode scanning',
        'Lot and serial number tracking'
      ],
      image: 'https://www.odoo.com/web/image/website.s_three_columns_default_image_1'
    },
    {
      id: 'accounting',
      title: 'Accounting',
      description: 'Manage your finances with a complete accounting solution that handles invoicing, payments, and financial reporting.',
      features: [
        'Automated invoicing',
        'Payment tracking',
        'Financial reporting',
        'Tax calculation',
        'Multi-currency support'
      ],
      image: 'https://www.odoo.com/web/image/website.s_three_columns_default_image_2'
    },
    {
      id: 'hr',
      title: 'Human Resources',
      description: 'Manage your most valuable assets - your employees - with our comprehensive HR management system.',
      features: [
        'Employee records management',
        'Leave and attendance tracking',
        'Recruitment process',
        'Performance evaluations',
        'Payroll integration'
      ],
      image: 'https://www.odoo.com/web/image/website.s_three_columns_default_image_3'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-odoo-dark">Integrated Business Modules</h2>
          <p className="mt-4 text-lg text-odoo-gray max-w-3xl mx-auto">
            Explore our range of fully integrated business applications designed to streamline your operations.
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-odoo-light p-1 rounded-lg mb-8">
            {modules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="py-2 data-[state=active]:bg-white data-[state=active]:text-odoo-primary"
              >
                {module.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {modules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="p-4">
              <Module
                title={module.title}
                description={module.description}
                features={module.features}
                image={module.image}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default AppModules;
