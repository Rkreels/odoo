
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  manager: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar: string;
  address: string;
  workLocation: string;
  employeeType: 'full_time' | 'part_time' | 'contractor';
  skills: string[];
}

interface LeaveRequest {
  id: string;
  employee: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  approver?: string;
}

interface Timesheet {
  id: string;
  employee: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
}

const HumanResources = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 234 567 8900',
      department: 'Sales',
      position: 'Sales Manager',
      manager: 'John Smith',
      hireDate: '2022-03-15',
      salary: 75000,
      status: 'active',
      avatar: '/placeholder-avatar.jpg',
      address: '123 Main St, New York, NY',
      workLocation: 'New York Office',
      employeeType: 'full_time',
      skills: ['Sales', 'CRM', 'Negotiation']
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1 234 567 8901',
      department: 'Engineering',
      position: 'Software Developer',
      manager: 'Alice Brown',
      hireDate: '2021-07-20',
      salary: 85000,
      status: 'active',
      avatar: '/placeholder-avatar.jpg',
      address: '456 Tech Ave, San Francisco, CA',
      workLocation: 'San Francisco Office',
      employeeType: 'full_time',
      skills: ['React', 'Node.js', 'Python']
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 234 567 8902',
      department: 'Marketing',
      position: 'Marketing Specialist',
      manager: 'David Lee',
      hireDate: '2023-01-10',
      salary: 60000,
      status: 'on_leave',
      avatar: '/placeholder-avatar.jpg',
      address: '789 Marketing Blvd, Chicago, IL',
      workLocation: 'Chicago Office',
      employeeType: 'full_time',
      skills: ['Digital Marketing', 'SEO', 'Content Creation']
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employee: 'Emily Davis',
      type: 'vacation',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: '2',
      employee: 'Mike Wilson',
      type: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      status: 'approved',
      reason: 'Flu symptoms',
      approver: 'Alice Brown'
    }
  ]);

  const [timesheets, setTimesheets] = useState<Timesheet[]>([
    {
      id: '1',
      employee: 'Sarah Johnson',
      date: '2024-01-22',
      project: 'CRM Implementation',
      task: 'Client meetings',
      hours: 8,
      description: 'Met with potential clients to discuss CRM solutions',
      status: 'approved'
    },
    {
      id: '2',
      employee: 'Mike Wilson',
      date: '2024-01-22',
      project: 'Website Redesign',
      task: 'Frontend development',
      hours: 7.5,
      description: 'Worked on responsive design components',
      status: 'submitted'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const employeeFilters = [
    { label: 'Active', value: 'active', count: employees.filter(e => e.status === 'active').length },
    { label: 'On Leave', value: 'on_leave', count: employees.filter(e => e.status === 'on_leave').length },
    { label: 'Full Time', value: 'full_time', count: employees.filter(e => e.employeeType === 'full_time').length },
    { label: 'Part Time', value: 'part_time', count: employees.filter(e => e.employeeType === 'part_time').length }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      on_leave: 'bg-yellow-500',
      pending: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         employee.status === selectedFilter ||
                         employee.employeeType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const avgSalary = employees.reduce((sum, e) => sum + e.salary, 0) / employees.length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  const renderEmployeesList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Employee</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-1">Position</div>
        <div className="col-span-1">Manager</div>
        <div className="col-span-1">Hire Date</div>
        <div className="col-span-1">Salary</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Location</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredEmployees.map(employee => (
        <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{employee.name}</p>
                <p className="text-xs text-gray-600">{employee.email}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{employee.department}</Badge>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{employee.position}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{employee.manager}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{employee.hireDate}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${employee.salary.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="secondary">{employee.employeeType.replace('_', ' ')}</Badge>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{employee.workLocation.split(' ')[0]}</span>
            </div>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(employee.status)}`}>
              {employee.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLeaveRequests = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Employee</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-2">Start Date</div>
        <div className="col-span-2">End Date</div>
        <div className="col-span-1">Days</div>
        <div className="col-span-2">Reason</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {leaveRequests.map(request => (
        <div key={request.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{request.employee}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{request.type}</Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{request.startDate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{request.endDate}</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">{request.days}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{request.reason}</p>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStatusColor(request.status)}`}>
              {request.status}
            </Badge>
          </div>
          <div className="col-span-1">
            {request.status === 'pending' && (
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Human Resources">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={
            activeTab === 'employees' ? 'Employees' :
            activeTab === 'leaves' ? 'Leave Requests' :
            'Timesheets'
          }
          subtitle={
            activeTab === 'employees' ? 'Manage employee records and information' :
            activeTab === 'leaves' ? 'Track and approve time off requests' :
            'Monitor work hours and project time'
          }
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'employees' ? employeeFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'employees' ? filteredEmployees.length : 
                      activeTab === 'leaves' ? leaveRequests.length : timesheets.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
              <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="employees" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalEmployees}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{activeEmployees}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">${Math.round(avgSalary).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Leaves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{pendingLeaves}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderEmployeesList()}
            </div>
          </TabsContent>

          <TabsContent value="leaves" className="flex-1 p-6">
            {renderLeaveRequests()}
          </TabsContent>

          <TabsContent value="timesheets" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Timesheet management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default HumanResources;
