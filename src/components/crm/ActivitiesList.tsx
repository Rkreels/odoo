
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Phone, Mail, Users, MessageSquare, Plus, Filter } from 'lucide-react';
import { Activity, ActivityType, LeadPriority } from '@/types/crm';
import CreateActivityForm from './CreateActivityForm';

const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'Call',
    title: 'Follow up with John Smith',
    description: 'Discuss project requirements and budget',
    dueDate: '2024-01-25T10:00:00Z',
    assignedTo: 'Jane Doe',
    leadId: '1',
    completed: false,
    priority: 'High',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    type: 'Email',
    title: 'Send proposal to XYZ Industries',
    description: 'Send detailed proposal document',
    dueDate: '2024-01-26T14:00:00Z',
    assignedTo: 'Mike Wilson',
    leadId: '2',
    completed: false,
    priority: 'Medium',
    createdAt: '2024-01-22T09:00:00Z',
  },
  {
    id: '3',
    type: 'Meeting',
    title: 'Product demo for Globex Corp',
    description: 'Schedule and conduct product demonstration',
    dueDate: '2024-01-24T15:30:00Z',
    assignedTo: 'Jane Doe',
    completed: true,
    priority: 'High',
    createdAt: '2024-01-21T11:00:00Z',
  },
];

const ActivitiesList = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleActivityCreate = (newActivity: Activity) => {
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleActivityToggle = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };

  const filteredActivities = activities.filter(activity => {
    const typeMatch = filterType === 'all' || activity.type.toLowerCase() === filterType.toLowerCase();
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'completed' && activity.completed) ||
      (filterStatus === 'pending' && !activity.completed);
    return typeMatch && statusMatch;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call': return <Phone className="h-4 w-4" />;
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Meeting': return <Users className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ActivityType) => {
    switch (type) {
      case 'Call': return 'bg-blue-100 text-blue-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'Meeting': return 'bg-purple-100 text-purple-800';
      case 'SMS': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: LeadPriority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Schedule Activity
          </Button>
          <Button variant="outline" disabled={selectedActivities.length === 0}>
            Mark as Done
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="sms">SMS</option>
            <option value="to do">To Do</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            More Filters
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => {
                      setSelectedActivities(prev => 
                        prev.includes(activity.id) 
                          ? prev.filter(id => id !== activity.id)
                          : [...prev, activity.id]
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{activity.title}</div>
                    {activity.description && (
                      <div className="text-sm text-gray-500">{activity.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(activity.type)} variant="outline">
                    <div className="flex items-center space-x-1">
                      {getActivityIcon(activity.type)}
                      <span>{activity.type}</span>
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(activity.dueDate).toLocaleDateString()}
                    <div className="text-xs text-gray-500">
                      {new Date(activity.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{activity.assignedTo}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(activity.priority)} variant="outline">
                    {activity.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={activity.completed}
                    onCheckedChange={() => handleActivityToggle(activity.id)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateActivityForm 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onActivityCreate={handleActivityCreate}
      />
    </div>
  );
};

export default ActivitiesList;
