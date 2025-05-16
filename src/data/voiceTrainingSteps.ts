
import { TrainingStep } from '@/types/voiceTrainer'; // Assuming TrainingStep type is defined or will be defined

export const getTrainingStepsForScreen = (currentScreen: string): TrainingStep[] => {
  let steps: TrainingStep[] = [];
  switch (currentScreen) {
    case 'dashboard':
      steps = [
        { id: 'welcome', title: 'Welcome to OdooEcho', description: "Welcome to OdooEcho! I'm your voice assistant and I'll help you learn how to use this powerful business management platform. Let me guide you through the main components of the dashboard.", completed: false },
        { id: 'navigation', title: 'Navigation', description: "On the left side, you'll find the application menu. This is where you can access different modules like CRM, Sales, Inventory, and more. Click on any app icon to navigate to that application.", element: '.sidebar', completed: false },
        { id: 'app-stats', title: 'Overview Cards', description: "At the top of your dashboard, you'll see overview cards that provide key metrics and statistics. These give you a quick snapshot of your business performance.", element: '.app-stats', completed: false },
        { id: 'header', title: 'Header Controls', description: 'In the top header, you can access quick actions, search functionality, notifications, and your user profile. This navigation bar is always accessible throughout the application.', element: 'header', completed: false },
        { id: 'conclusion', title: 'Getting Started', description: "That's a quick overview of your dashboard! To get started, try clicking on the CRM app on the left sidebar. You can restart this tutorial anytime by clicking the Voice Guide button in the header.", completed: false },
      ];
      break;
    case 'crm':
      steps = [
        { id: 'crm-welcome', title: 'CRM Module', description: "Welcome to the CRM module! This is where you'll manage your customer relationships, leads, opportunities, and sales pipeline.", completed: false },
        { id: 'leads-list', title: 'Leads List', description: 'This table shows all your leads. You can see important information like contact details, status, and expected revenue at a glance.', element: '.leads-list', completed: false },
        { id: 'crm-actions', title: 'Actions', description: "At the top of the list, you'll find action buttons to create new leads, perform mass actions, and search for specific records.", element: '.crm-actions', completed: false },
        { id: 'lead-filters', title: 'Filters', description: 'You can filter leads by status using the dropdown menu. This helps you focus on leads at specific stages like New, Qualified, or Won.', completed: false },
        { id: 'crm-conclusion', title: 'Next Steps', description: 'To get started with CRM, try creating a new lead by clicking the Create button. You can also click on any existing lead to view more details and take actions.', completed: false },
      ];
      break;
    case 'blog':
      steps = [
        { id: 'blog-welcome', title: 'Blog Module', description: 'Welcome to the Blog module! Here you can create and manage blog posts, organize them into categories, and engage with your audience.', completed: false },
        { id: 'blog-create-post', title: 'Create Posts', description: 'Use the "Create New Post" button to start writing new articles. You can use a rich text editor, add images, and set publication dates.', completed: false },
        { id: 'blog-manage', title: 'Manage Content', description: 'View your existing posts, edit them, or manage categories to keep your blog organized.', completed: false },
      ];
      break;
    case 'forum':
      steps = [
        { id: 'forum-welcome', title: 'Forum Module', description: 'Welcome to the Community Forum! This is the place to foster discussions, create topics, and build an active community.', completed: false },
        { id: 'forum-create-topic', title: 'Start Discussions', description: 'Click "Create New Topic" to initiate new discussions. Users can reply, and you can moderate conversations.', completed: false },
        { id: 'forum-categories', title: 'Organize Content', description: 'Manage forum categories to structure discussions and help users find relevant topics easily.', completed: false },
      ];
      break;
    case 'accounting':
      steps = [
        { id: 'acc-welcome', title: 'Accounting Module', description: 'Welcome to Accounting. Manage invoices, expenses, and financial reports.', completed: false },
        { id: 'acc-charts', title: 'Charts & Reports', description: 'View financial summaries and generate reports.', completed: false },
        { id: 'acc-transactions', title: 'Transactions', description: 'Record and track all financial transactions.', completed: false },
      ];
      break;
    case 'humanresources':
      steps = [
        { id: 'hr-welcome', title: 'Human Resources', description: 'Manage employees, recruitment, and payroll in the HR module.', completed: false },
        { id: 'hr-employees', title: 'Employee Directory', description: 'Access and manage employee information.', completed: false },
        { id: 'hr-payroll', title: 'Payroll Processing', description: 'Process payroll and manage compensations.', completed: false },
      ];
      break;
    case 'website':
      steps = [
        { id: 'web-welcome', title: 'Website Builder', description: 'Welcome to the Website builder. Create and customize your online presence.', completed: false },
        { id: 'web-pages', title: 'Manage Pages', description: 'Add new pages or edit existing ones using a drag-and-drop interface.', completed: false },
        { id: 'web-themes', title: 'Themes & SEO', description: 'Customize themes and manage SEO settings for better visibility.', completed: false },
      ];
      break;
    case 'ecommerce':
      steps = [
        { id: 'ecom-welcome', title: 'eCommerce Management', description: 'Manage your online store, products, orders, and customers.', completed: false },
        { id: 'ecom-products', title: 'Product Catalog', description: 'Add, edit, and organize your products.', completed: false },
        { id: 'ecom-orders', title: 'Order Processing', description: 'Track and fulfill customer orders efficiently.', completed: false },
      ];
      break;
    case 'discuss':
      steps = [
        { id: 'disc-welcome', title: 'Discuss App', description: 'Communicate with your team, manage channels, and stay updated.', completed: false },
        { id: 'disc-channels', title: 'Channels', description: 'Join or create channels for specific topics or teams.', completed: false },
        { id: 'disc-messages', title: 'Direct Messages', description: 'Send direct messages to your colleagues.', completed: false },
      ];
      break;
    case 'elearning':
      steps = [
        { id: 'elearning-welcome', title: 'eLearning Module', description: 'Welcome to the eLearning module! Manage online courses, enroll students, and track their progress.', completed: false },
        { id: 'elearning-create-course', title: 'Create Courses', description: 'Use the "Create New Course" button to design and publish educational content.', completed: false },
        { id: 'elearning-manage-students', title: 'Manage Students', description: 'Oversee student enrollments, track learning paths, and issue certificates.', completed: false },
      ];
      break;
    case 'pointofsale':
      steps = [
        { id: 'pos-welcome', title: 'Point of Sale Module', description: 'Welcome to the Point of Sale (PoS) module! Handle in-store transactions, manage sessions, and integrate with inventory.', completed: false },
        { id: 'pos-new-session', title: 'Open Session', description: 'Start a new PoS session to begin processing sales. Each session tracks transactions independently.', completed: false },
        { id: 'pos-reports', title: 'Sales Reports', description: 'Access detailed sales reports to analyze performance and track revenue from your physical store operations.', completed: false },
      ];
      break;
    case 'invoicing':
      steps = [
        { id: 'invoicing-welcome', title: 'Invoicing Module', description: 'Welcome to the Invoicing module! Create, send, and track customer invoices and payments.', completed: false },
        { id: 'invoicing-create-invoice', title: 'Create Invoices', description: 'Generate professional invoices for your products or services using the "Create New Invoice" button.', completed: false },
        { id: 'invoicing-track-payments', title: 'Track Payments', description: 'Monitor the payment status of your invoices and manage outstanding balances.', completed: false },
      ];
      break;
    case 'purchase':
      steps = [
        { id: 'purchase-welcome', title: 'Purchase Module', description: 'Welcome to the Purchase module! Manage your procurement process, from purchase orders to supplier management.', completed: false },
        { id: 'purchase-create-po', title: 'Create Purchase Orders', description: 'Use the "Create Purchase Order" button to request goods or services from your suppliers.', completed: false },
        { id: 'purchase-manage-suppliers', title: 'Manage Suppliers', description: 'Keep a directory of your suppliers and track your purchasing history with them.', completed: false },
      ];
      break;
    // Newly added modules
    case 'livechat':
      steps = [
        { id: 'livechat-welcome', title: 'Live Chat Module', description: 'Welcome to Live Chat! Connect with your website visitors in real-time.', completed: false },
        { id: 'livechat-setup', title: 'Setup Chat Widget', description: 'Configure and embed the chat widget on your website to start engaging with customers.', completed: false },
        { id: 'livechat-conversations', title: 'Manage Conversations', description: 'View and respond to ongoing chats from your dashboard.', completed: false },
      ];
      break;
    case 'subscriptions':
      steps = [
        { id: 'subs-welcome', title: 'Subscriptions Module', description: 'Welcome to Subscriptions! Manage recurring billing and subscription plans.', completed: false },
        { id: 'subs-create-plan', title: 'Create Plans', description: 'Set up different subscription plans for your services or products.', completed: false },
        { id: 'subs-manage', title: 'Manage Subscribers', description: 'Track active subscriptions, renewals, and cancellations.', completed: false },
      ];
      break;
    case 'rental':
      steps = [
        { id: 'rental-welcome', title: 'Rental Module', description: 'Welcome to Rental Management! Rent out products and manage your rental operations.', completed: false },
        { id: 'rental-add-product', title: 'Add Rental Products', description: 'List products available for rent, set pricing, and availability.', completed: false },
        { id: 'rental-manage-bookings', title: 'Manage Bookings', description: 'Track rental orders, schedules, and returns.', completed: false },
      ];
      break;
    case 'expenses':
      steps = [
        { id: 'exp-welcome', title: 'Expenses Module', description: 'Welcome to Expense Management! Streamline employee expense reporting.', completed: false },
        { id: 'exp-submit', title: 'Submit Expenses', description: 'Employees can submit expense reports for approval.', completed: false },
        { id: 'exp-approve', title: 'Approve Reports', description: 'Managers can review and approve expense submissions.', completed: false },
      ];
      break;
    case 'documents':
      steps = [
        { id: 'docs-welcome', title: 'Documents Module', description: 'Welcome to Document Management! Organize, share, and secure your files.', completed: false },
        { id: 'docs-upload', title: 'Upload Files', description: 'Upload various types of documents to a centralized repository.', completed: false },
        { id: 'docs-share', title: 'Share & Collaborate', description: 'Share documents with team members and control access permissions.', completed: false },
      ];
      break;
    case 'spreadsheets':
      steps = [
        { id: 'spread-welcome', title: 'Spreadsheets Module', description: 'Welcome to Spreadsheets! Create and collaborate on spreadsheets integrated with your data.', completed: false },
        { id: 'spread-create', title: 'Create New Spreadsheet', description: 'Start a new spreadsheet for data analysis, reporting, or planning.', completed: false },
        { id: 'spread-integrate', title: 'Data Integration', description: 'Link spreadsheets with other Odoo apps for real-time data.', completed: false },
      ];
      break;
    case 'sign':
      steps = [
        { id: 'sign-welcome', title: 'Sign Module', description: 'Welcome to Electronic Signatures! Send and sign documents digitally.', completed: false },
        { id: 'sign-send', title: 'Send for Signature', description: 'Upload documents and request electronic signatures from clients or partners.', completed: false },
        { id: 'sign-track', title: 'Track Status', description: 'Monitor the status of documents sent out for signature.', completed: false },
      ];
      break;
    case 'plm':
      steps = [
        { id: 'plm-welcome', title: 'PLM Module', description: 'Welcome to Product Lifecycle Management! Manage your product development from concept to end-of-life.', completed: false },
        { id: 'plm-boms', title: 'Manage BoMs', description: 'Create and manage Bill of Materials for your products.', completed: false },
        { id: 'plm-versions', title: 'Version Control', description: 'Track revisions and changes to product designs and specifications.', completed: false },
      ];
      break;
    case 'maintenance':
      steps = [
        { id: 'maint-welcome', title: 'Maintenance Module', description: 'Welcome to Maintenance Management! Track equipment and schedule maintenance tasks.', completed: false },
        { id: 'maint-requests', title: 'Maintenance Requests', description: 'Create and manage maintenance requests for equipment.', completed: false },
        { id: 'maint-schedule', title: 'Schedule Preventive Maintenance', description: 'Plan and track preventive maintenance to avoid breakdowns.', completed: false },
      ];
      break;
    case 'quality':
      steps = [
        { id: 'qual-welcome', title: 'Quality Module', description: 'Welcome to Quality Control! Ensure your products meet quality standards.', completed: false },
        { id: 'qual-points', title: 'Control Points', description: 'Set up quality control points at various stages of production or reception.', completed: false },
        { id: 'qual-checks', title: 'Perform Checks', description: 'Conduct quality checks and record results.', completed: false },
      ];
      break;
    default:
      steps = [
        { id: 'default', title: 'Welcome to OdooEcho', description: "Welcome to OdooEcho! I'm your voice assistant and I'll help you learn how to use this platform. Navigate to different sections to get specific guidance.", completed: false },
      ];
  }
  return steps;
};

