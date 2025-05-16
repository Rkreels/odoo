import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Apps from "./pages/Apps";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Manufacturing from "./pages/Manufacturing";
import Accounting from "./pages/Accounting";
import HumanResources from "./pages/HumanResources";
import Discuss from "./pages/Discuss";
import Website from "./pages/Website";
import Ecommerce from "./pages/Ecommerce";
import Blog from "./pages/Blog";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";
import Elearning from "./pages/Elearning";
import PointOfSale from "./pages/PointOfSale";
import Invoicing from "./pages/Invoicing";
import Purchase from "./pages/Purchase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apps/crm" element={<CRM />} />
          <Route path="/apps/sales" element={<Sales />} />
          <Route path="/apps/inventory" element={<Inventory />} />
          <Route path="/apps/manufacturing" element={<Manufacturing />} />
          <Route path="/apps/accounting" element={<Accounting />} />
          <Route path="/apps/hr" element={<HumanResources />} />
          <Route path="/apps/discuss" element={<Discuss />} />
          <Route path="/apps/website" element={<Website />} />
          <Route path="/apps/ecommerce" element={<Ecommerce />} />
          <Route path="/apps/blog" element={<Blog />} />
          <Route path="/apps/forum" element={<Forum />} />
          <Route path="/apps/elearning" element={<Elearning />} />
          <Route path="/apps/point-of-sale" element={<PointOfSale />} />
          <Route path="/apps/invoicing" element={<Invoicing />} />
          <Route path="/apps/purchase" element={<Purchase />} />
          {/* Other app routes will be added here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
