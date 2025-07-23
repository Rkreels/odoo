
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { CreditCard, Plus, Search, Filter, DollarSign, Clock, CheckCircle, XCircle, Calendar, FileText, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Expense } from '@/types/expenses';

const initialExpenses: Expense[] = [
  {
    id: '1',
    description: 'Business lunch with Tech Corp executives',
    amount: 125.80,
    date: '2024-01-15',
    category: 'Meals & Entertainment',
    employee: 'John Doe',
    status: 'pending',
    notes: 'Discussed Q1 partnership opportunities and contract renewal',
    receipt: 'receipt_001.pdf',
    mileage: 0,
    project: 'Tech Corp Partnership',
    department: 'Sales'
  },
  {
    id: '2',
    description: 'Annual Industry Conference Registration',
    amount: 850.00,
    date: '2024-01-12',
    category: 'Training & Education',
    employee: 'Sarah Smith',
    status: 'approved',
    approvedBy: 'David Manager',
    approvedDate: '2024-01-13',
    notes: 'Professional development for emerging technologies',
    receipt: 'conference_receipt.pdf',
    mileage: 0,
    project: 'Team Development',
    department: 'Engineering'
  },
  {
    id: '3',
    description: 'Taxi to airport for business trip',
    amount: 45.30,
    date: '2024-01-10',
    category: 'Transportation',
    employee: 'Mike Wilson',
    status: 'approved',
    approvedBy: 'Sarah Manager',
    approvedDate: '2024-01-11',
    notes: 'Travel to client meeting in Chicago',
    receipt: 'taxi_receipt.pdf',
    mileage: 0,
    project: 'Chicago Client Project',
    department: 'Consulting'
  },
  {
    id: '4',
    description: 'Office supplies for new team setup',
    amount: 234.75,
    date: '2024-01-20',
    category: 'Office Supplies',
    employee: 'Emily Johnson',
    status: 'pending',
    notes: 'Notebooks, pens, and desk organizers for 5 new hires',
    receipt: 'office_supplies.pdf',
    mileage: 0,
    project: 'Team Expansion',
    department: 'HR'
  },
  {
    id: '5',
    description: 'Client mileage reimbursement',
    amount: 67.50,
    date: '2024-01-18',
    category: 'Transportation',
    employee: 'Robert Brown',
    status: 'approved',
    approvedBy: 'Linda Director',
    approvedDate: '2024-01-19',
    notes: 'Round trip to client site for implementation',
    mileage: 150,
    project: 'Client Implementation',
    department: 'Implementation'
  },
  {
    id: '6',
    description: 'Software license for project',
    amount: 199.99,
    date: '2024-01-22',
    category: 'Software & Tools',
    employee: 'Alice Cooper',
    status: 'rejected',
    notes: 'License should be purchased through IT procurement process',
    receipt: 'software_license.pdf',
    mileage: 0,
    project: 'Internal Tools',
    department: 'IT'
  }
];

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('expenses');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

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

  const categories = Array.from(new Set(expenses.map(expense => expense.category)));
  const departments = Array.from(new Set(expenses.map(expense => expense.department || 'Unknown')));

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (expense.project?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const expenseFilters = [
    { label: 'All Expenses', value: 'all', count: expenses.length },
    { label: 'Pending', value: 'pending', count: expenses.filter(e => e.status === 'pending').length },
    { label: 'Approved', value: 'approved', count: expenses.filter(e => e.status === 'approved').length },
    { label: 'Rejected', value: 'rejected', count: expenses.filter(e => e.status === 'rejected').length }
  ];

  const totalPending = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const totalApproved = expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
  const totalRejected = expenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0);
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpenseAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

  const renderExpensesList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Description</div>
        <div className="col-span-2">Employee</div>
        <div className="col-span-1">Amount</div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Project</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {filteredExpenses.map(expense => (
        <div key={expense.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{expense.description}</p>
            {expense.notes && <p className="text-xs text-gray-600 mt-1">{expense.notes}</p>}
          </div>
          <div className="col-span-2">
            <p className="text-sm">{expense.employee}</p>
            <p className="text-xs text-gray-600">{expense.department}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${expense.amount.toFixed(2)}</p>
            {expense.mileage > 0 && <p className="text-xs text-gray-600">{expense.mileage} mi</p>}
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{expense.category}</Badge>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{expense.date}</p>
          </div>
          <div className="col-span-1">
            <Badge variant={
              expense.status === 'approved' ? 'default' : 
              expense.status === 'pending' ? 'secondary' : 'destructive'
            }>
              {expense.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{expense.project || '-'}</p>
          </div>
          <div className="col-span-2">
            <div className="flex space-x-1">
              {expense.status === 'pending' && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleApprove(expense.id)}>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleReject(expense.id)}>
                    <XCircle className="h-3 w-3 text-red-600" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedExpense(expense)}>
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Expenses">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'expenses' ? 'Expense Reports' : activeTab === 'analytics' ? 'Analytics' : 'Categories'}
          subtitle={
            activeTab === 'expenses' ? 'Track and approve employee expenses' :
            activeTab === 'analytics' ? 'Expense reporting and analytics' :
            'Manage expense categories'
          }
          searchPlaceholder="Search expenses..."
          onSearch={setSearchTerm}
          onCreateNew={() => setIsCreateModalOpen(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={expenseFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredExpenses.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="expenses" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold">${totalPending.toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalApproved.toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{expenses.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">${avgExpenseAmount.toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="p-6 bg-white border-b">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Category:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderExpensesList() : (
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
              )}
              
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No expenses found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map(category => {
                      const categoryExpenses = expenses.filter(e => e.category === category);
                      const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{category}</p>
                            <p className="text-xs text-gray-600">{categoryExpenses.length} expenses</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${categoryTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Spenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(expenses.map(e => e.employee))).map(employee => {
                      const employeeExpenses = expenses.filter(e => e.employee === employee);
                      const employeeTotal = employeeExpenses.reduce((sum, e) => sum + e.amount, 0);
                      return (
                        <div key={employee} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{employee}</p>
                            <p className="text-xs text-gray-600">{employeeExpenses.length} expenses</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${employeeTotal.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Generate monthly expense summary</p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employee Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Individual employee expense reports</p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Tax-deductible expense summary</p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-gray-600">{selectedExpense.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-gray-600">${selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Employee</label>
                  <p className="text-sm text-gray-600">{selectedExpense.employee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-gray-600">{selectedExpense.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-gray-600">{selectedExpense.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={selectedExpense.status === 'approved' ? 'default' : selectedExpense.status === 'pending' ? 'secondary' : 'destructive'}>
                    {selectedExpense.status}
                  </Badge>
                </div>
              </div>
              {selectedExpense.notes && (
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="text-sm text-gray-600">{selectedExpense.notes}</p>
                </div>
              )}
              {selectedExpense.receipt && (
                <div>
                  <label className="text-sm font-medium">Receipt</label>
                  <Button variant="outline" size="sm" className="ml-2">
                    <FileText className="h-4 w-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedExpense(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </OdooMainLayout>
  );
};

export default Expenses;
