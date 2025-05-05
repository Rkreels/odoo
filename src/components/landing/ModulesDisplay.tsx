
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ModuleItemProps {
  icon: string;
  color: string;
  title: string;
  description: string;
}

const ModuleItem = ({ icon, color, title, description }: ModuleItemProps) => (
  <div className="flex items-start space-x-3 mb-6">
    <div 
      className="w-10 h-10 rounded-md flex items-center justify-center text-white text-lg flex-shrink-0 mt-1"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-lg text-odoo-dark">{title}</h3>
      <p className="text-sm text-odoo-gray">{description}</p>
    </div>
  </div>
);

const ModulesDisplay = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12 italic text-center">One need, one app.</h2>
        
        {/* Website Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Website</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="🌐" 
              color="#28BDBE" 
              title="Website" 
              description="Create stunning websites easily with our drag & drop builder" 
            />
            <ModuleItem 
              icon="🛍️" 
              color="#875A7B" 
              title="eCommerce" 
              description="Sell online with a powerful and fully featured online store" 
            />
            <ModuleItem 
              icon="📝" 
              color="#5D8DA8" 
              title="Blog" 
              description="Publish content and grow your online presence" 
            />
            <ModuleItem 
              icon="💬" 
              color="#28BDBE" 
              title="Forum" 
              description="Build a community for your customers and users" 
            />
            <ModuleItem 
              icon="🎓" 
              color="#32A350" 
              title="eLearning" 
              description="Create online courses and training materials" 
            />
            <ModuleItem 
              icon="💻" 
              color="#8F4B99" 
              title="Live Chat" 
              description="Talk with visitors and convert leads in real-time" 
            />
          </div>
        </section>
        
        {/* Sales Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Sales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="🔰" 
              color="#00A09D" 
              title="CRM" 
              description="Boost sales with lead automation and pipeline management" 
            />
            <ModuleItem 
              icon="📊" 
              color="#D5653E" 
              title="Sales" 
              description="From quotation to invoice with advanced sales features" 
            />
            <ModuleItem 
              icon="🛒" 
              color="#5D8DA8" 
              title="Point of Sale" 
              description="Modern POS with hardware and inventory integration" 
            />
            <ModuleItem 
              icon="🔄" 
              color="#32A350" 
              title="Subscriptions" 
              description="Manage recurring billing and subscription business" 
            />
            <ModuleItem 
              icon="🏠" 
              color="#8F4B99" 
              title="Rental" 
              description="Rent products and manage your rental business" 
            />
          </div>
        </section>
        
        {/* Finance Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Finance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="📝" 
              color="#54B948" 
              title="Accounting" 
              description="Manage finances and automate your accounting" 
            />
            <ModuleItem 
              icon="💰" 
              color="#28BDBE" 
              title="Invoicing" 
              description="Create and send professional invoices easily" 
            />
            <ModuleItem 
              icon="💸" 
              color="#5D8DA8" 
              title="Expenses" 
              description="Streamline employee expense reporting and approval" 
            />
            <ModuleItem 
              icon="📄" 
              color="#3461AA" 
              title="Documents" 
              description="Organize, share, and secure your business documents" 
            />
            <ModuleItem 
              icon="📊" 
              color="#D5653E" 
              title="Spreadsheets" 
              description="Collaborative spreadsheets integrated with your data" 
            />
            <ModuleItem 
              icon="✍️" 
              color="#00A09D" 
              title="Sign" 
              description="Electronic signatures for your documents" 
            />
          </div>
        </section>
        
        {/* Inventory & Manufacturing Section - Added as requested */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Inventory & Manufacturing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="📦" 
              color="#2C8397" 
              title="Inventory" 
              description="Track inventory levels in real-time across warehouses" 
            />
            <ModuleItem 
              icon="🏭" 
              color="#D5653E" 
              title="Manufacturing" 
              description="Plan, track and optimize your production processes" 
            />
            <ModuleItem 
              icon="🔧" 
              color="#8F4B99" 
              title="Maintenance" 
              description="Schedule and track equipment maintenance efficiently" 
            />
            <ModuleItem 
              icon="🛒" 
              color="#32A350" 
              title="Purchase" 
              description="Streamline procurement from requisition to payment" 
            />
            <ModuleItem 
              icon="📋" 
              color="#3461AA" 
              title="PLM" 
              description="Manage your product lifecycle from design to production" 
            />
            <ModuleItem 
              icon="✓" 
              color="#00A09D" 
              title="Quality" 
              description="Implement quality control throughout your operations" 
            />
          </div>
        </section>
        
        {/* Human Resources Section - Added as requested */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Human Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="👥" 
              color="#875A7B" 
              title="Employees" 
              description="Manage employee information, documents and contracts" 
            />
            <ModuleItem 
              icon="⏱️" 
              color="#28BDBE" 
              title="Time Off" 
              description="Track and approve employee leave requests efficiently" 
            />
            <ModuleItem 
              icon="📈" 
              color="#D5653E" 
              title="Appraisals" 
              description="Conduct performance reviews and set employee goals" 
            />
            <ModuleItem 
              icon="🎯" 
              color="#32A350" 
              title="Recruitment" 
              description="Streamline your hiring process from application to onboarding" 
            />
            <ModuleItem 
              icon="💼" 
              color="#5D8DA8" 
              title="Expenses" 
              description="Simplify expense submission, approval and reimbursement" 
            />
            <ModuleItem 
              icon="💰" 
              color="#8F4B99" 
              title="Payroll" 
              description="Automate salary calculations and payment processing" 
            />
          </div>
        </section>
        
        {/* Marketing Section - Added as requested */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Marketing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="📧" 
              color="#00A09D" 
              title="Email Marketing" 
              description="Create and send targeted email campaigns to your audience" 
            />
            <ModuleItem 
              icon="🔍" 
              color="#3461AA" 
              title="SEO" 
              description="Optimize your website for better search engine rankings" 
            />
            <ModuleItem 
              icon="📱" 
              color="#D5653E" 
              title="Social Marketing" 
              description="Manage your social media presence and campaigns" 
            />
            <ModuleItem 
              icon="📊" 
              color="#32A350" 
              title="Marketing Analytics" 
              description="Track campaign performance and conversion metrics" 
            />
            <ModuleItem 
              icon="🎯" 
              color="#8F4B99" 
              title="Marketing Automation" 
              description="Create automated workflows for your marketing activities" 
            />
            <ModuleItem 
              icon="📝" 
              color="#5D8DA8" 
              title="Surveys" 
              description="Gather customer feedback with custom surveys" 
            />
          </div>
        </section>
        
        {/* Service Section - Added as requested */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="🎫" 
              color="#875A7B" 
              title="Helpdesk" 
              description="Manage customer support tickets and service requests" 
            />
            <ModuleItem 
              icon="📆" 
              color="#28BDBE" 
              title="Appointments" 
              description="Allow customers to book appointments online" 
            />
            <ModuleItem 
              icon="📞" 
              color="#D5653E" 
              title="VoIP Integration" 
              description="Handle customer calls directly within your system" 
            />
            <ModuleItem 
              icon="💬" 
              color="#3461AA" 
              title="Live Chat" 
              description="Provide real-time support to your website visitors" 
            />
            <ModuleItem 
              icon="🤖" 
              color="#32A350" 
              title="Chatbot" 
              description="Automate customer interactions with intelligent chatbots" 
            />
            <ModuleItem 
              icon="📚" 
              color="#5D8DA8" 
              title="Knowledge Base" 
              description="Create a self-service portal for common questions" 
            />
          </div>
        </section>
        
        {/* Productivity Section - Added as requested */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 italic">Productivity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <ModuleItem 
              icon="✅" 
              color="#00A09D" 
              title="Project Management" 
              description="Plan, track and manage your projects and tasks" 
            />
            <ModuleItem 
              icon="📅" 
              color="#8F4B99" 
              title="Calendar" 
              description="Manage your schedule and team availability" 
            />
            <ModuleItem 
              icon="📁" 
              color="#D5653E" 
              title="Documents" 
              description="Store, share and collaborate on documents" 
            />
            <ModuleItem 
              icon="📊" 
              color="#3461AA" 
              title="Spreadsheets" 
              description="Create and edit collaborative spreadsheets" 
            />
            <ModuleItem 
              icon="📄" 
              color="#5D8DA8" 
              title="Notes" 
              description="Capture and organize ideas and information" 
            />
            <ModuleItem 
              icon="💬" 
              color="#32A350" 
              title="Discuss" 
              description="Team collaboration and internal communication platform" 
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
    </div>
  );
};

export default ModulesDisplay;
