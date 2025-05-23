
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { CreditCard, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Expense } from '@/types/expenses';

const initialExpenses: Expense[] = [
  {
    id: '1',
    description: 'Business lunch with client',
    amount: 85.50,
    date: '2024-01-15',
    category: 'Meals & Entertainment',
    employee: 'John Doe',
    status: 'pending',
    notes: 'Discussed new project proposal',
  },
  {
    id: '2',
    description: 'Conference attendance',
    amount: 450.00,
    date: '2024-01-12',
    category: 'Training & Education',
    employee: 'Sarah Smith',
    status: 'approved',
    approvedBy: 'Manager',
    approvedDate: '2024-01-13',
  },
  {
    id: '3',
    description: 'Office supplies',
    amount: 32.75,
    date: '2024-01-10',
    category: 'Office Supplies',
    employee: 'Mike Wilson',
    status: 'rejected',
    notes: 'Not a business expense',
  },
];

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  const handleApprove = (id: string) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { ...expense, status: 'approved' as const, approvedBy: 'Current User', approvedDate: new Date().toLocaleDateString() }
        : expense
    ));
  };

  const handleReject = (id: string) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { ...expense, status: 'rejected' as const }
        : expense
    ));
  };

  const handleView = (expense: Expense) => {
    console.log('View expense details:', expense);
    // Future: Implement expense detail view
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

  return (
    <TopbarDashboardLayout currentApp="Expenses">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Expense Management</h1>
                <p className="text-odoo-gray">Track and approve employee expenses</p>
              </div>
            </div>
            <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Submit Expense Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">Pending Approval</h3>
              <p className="text-2xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Approved This Month</h3>
              <p className="text-2xl font-bold text-green-600">${totalApproved.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Total Reports</h3>
              <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onApprove={handleApprove}
                onReject={handleReject}
                onView={handleView}
              />
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Expenses;
