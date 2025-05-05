
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Filter, Calendar, Users, User, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HumanResources = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Mock employees data
  const employees = [
    {
      id: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Development',
      position: 'Senior Developer',
      joinDate: '2022-05-15',
      status: 'Active',
      avatar: '',
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      joinDate: '2023-02-10',
      status: 'Active',
      avatar: '',
    },
    {
      id: 'EMP003',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      department: 'Sales',
      position: 'Sales Executive',
      joinDate: '2022-11-05',
      status: 'Active',
      avatar: '',
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      department: 'Human Resources',
      position: 'HR Specialist',
      joinDate: '2021-08-20',
      status: 'On Leave',
      avatar: '',
    },
    {
      id: 'EMP005',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      department: 'Development',
      position: 'Junior Developer',
      joinDate: '2023-09-12',
      status: 'Active',
      avatar: '',
    },
    {
      id: 'EMP006',
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      department: 'Finance',
      position: 'Financial Analyst',
      joinDate: '2022-03-18',
      status: 'Inactive',
      avatar: '',
    },
  ];

  // Mock time off requests
  const timeOffRequests = [
    {
      id: 'TO001',
      employee: 'John Doe',
      type: 'Vacation',
      startDate: '2025-05-20',
      endDate: '2025-05-27',
      duration: '8 days',
      status: 'Approved',
    },
    {
      id: 'TO002',
      employee: 'Jane Smith',
      type: 'Sick Leave',
      startDate: '2025-05-15',
      endDate: '2025-05-16',
      duration: '2 days',
      status: 'Approved',
    },
    {
      id: 'TO003',
      employee: 'Emily Davis',
      type: 'Maternity Leave',
      startDate: '2025-06-01',
      endDate: '2025-09-01',
      duration: '92 days',
      status: 'Pending',
    },
    {
      id: 'TO004',
      employee: 'Michael Wilson',
      type: 'Personal Leave',
      startDate: '2025-05-25',
      endDate: '2025-05-26',
      duration: '2 days',
      status: 'Pending',
    },
  ];

  // Filter employees based on search and department filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = filterDepartment === 'all' || employee.department.toLowerCase() === filterDepartment.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  // Toggle item selection
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredEmployees.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredEmployees.map(emp => emp.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <TopbarDashboardLayout currentApp="Human Resources">
      <div className="p-6">
        {/* HR Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">HR Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Total Employees', count: employees.length, color: 'bg-blue-500' },
              { name: 'Active Employees', count: employees.filter(emp => emp.status === 'Active').length, color: 'bg-green-500' },
              { name: 'Pending Time Off', count: timeOffRequests.filter(req => req.status === 'Pending').length, color: 'bg-yellow-500' },
              { name: 'Departments', count: [...new Set(employees.map(emp => emp.department))].length, color: 'bg-purple-500' },
            ].map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{metric.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{metric.count}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <Tabs defaultValue="employees" className="w-full">
              <div className="px-4 pt-4">
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="timeoff">Time Off</TabsTrigger>
                  <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Employees Tab */}
              <TabsContent value="employees" className="p-0">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Employee
                    </Button>
                    <Button variant="outline" className="mr-2" disabled={selectedItems.length === 0}>
                      <Users className="h-4 w-4 mr-1" />
                      Bulk Action
                    </Button>
                    <div className="relative ml-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="search"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary w-full sm:w-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="development">Development</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="human resources">Human Resources</option>
                      <option value="finance">Finance</option>
                    </select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      More Filters
                    </Button>
                  </div>
                </div>
                
                {/* Employees Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedItems.length === filteredEmployees.length && filteredEmployees.length > 0} 
                            onCheckedChange={toggleSelectAll} 
                            aria-label="Select all employees"
                          />
                        </TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <TableRow key={employee.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(employee.id)} 
                                onCheckedChange={() => toggleSelectItem(employee.id)} 
                                aria-label={`Select ${employee.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={employee.avatar} />
                                  <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{employee.name}</div>
                                  <div className="text-sm text-odoo-gray">{employee.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.joinDate}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(employee.status)} variant="outline">
                                {employee.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No employees found matching your filters. Try adjusting your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t flex items-center justify-between">
                  <div className="text-sm text-odoo-gray">
                    Showing {filteredEmployees.length} of {employees.length} employees
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Time Off Tab */}
              <TabsContent value="timeoff" className="p-0">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <Button variant="outline" className="mr-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Request Time Off
                    </Button>
                    <Button variant="outline" className="mr-2">
                      <Clock className="h-4 w-4 mr-1" />
                      Allocate Leave
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Calendar View
                    </Button>
                  </div>
                </div>
                
                {/* Time Off Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeOffRequests.map((request) => (
                        <TableRow key={request.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.employee}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.startDate} to {request.endDate}</TableCell>
                          <TableCell>{request.duration}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)} variant="outline">
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Recruitment Tab */}
              <TabsContent value="recruitment" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Job Positions', count: 8, description: 'Manage open positions and job requirements', icon: <User className="h-8 w-8 text-blue-500" /> },
                    { title: 'Applications', count: 24, description: 'Review and process candidates applications', icon: <Users className="h-8 w-8 text-green-500" /> },
                    { title: 'Interviews', count: 5, description: 'Schedule and manage candidate interviews', icon: <Calendar className="h-8 w-8 text-purple-500" /> },
                  ].map((item, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="mr-4">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-odoo-dark">{item.title}</h3>
                              <span className="text-lg font-semibold text-odoo-primary">{item.count}</span>
                            </div>
                            <p className="text-sm text-odoo-gray mt-2">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Recent Applications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: 'David Lee', position: 'Senior Developer', appliedOn: '2025-05-01', status: 'Interview' },
                        { name: 'Marie Johnson', position: 'Marketing Specialist', appliedOn: '2025-04-28', status: 'Shortlisted' },
                        { name: 'James Smith', position: 'Sales Executive', appliedOn: '2025-04-25', status: 'New' },
                      ].map((application, i) => (
                        <TableRow key={i} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-medium">{application.name}</TableCell>
                          <TableCell>{application.position}</TableCell>
                          <TableCell>{application.appliedOn}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(application.status)} variant="outline">
                              {application.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Department Structure', description: 'Configure your organization departments and hierarchy' },
                    { title: 'Leave Types', description: 'Set up different types of leaves and their policies' },
                    { title: 'Working Hours', description: 'Define working schedules for different employee groups' },
                    { title: 'Job Positions', description: 'Manage job titles, descriptions and requirements' },
                  ].map((setting, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium text-odoo-dark mb-2">{setting.title}</h3>
                        <p className="text-sm text-odoo-gray">{setting.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default HumanResources;
