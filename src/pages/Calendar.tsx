import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import { CalendarDays, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'meeting' | 'call' | 'task' | 'event';
  attendees: string[];
  location?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync-up meeting',
      start: '2024-01-15T10:00:00',
      end: '2024-01-15T11:00:00',
      type: 'meeting',
      attendees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
      location: 'Conference Room A',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Client Call - ABC Corp',
      description: 'Quarterly review call with ABC Corporation',
      start: '2024-01-16T14:00:00',
      end: '2024-01-16T15:30:00',
      type: 'call',
      attendees: ['Sarah Wilson', 'Michael Brown'],
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Submit final project deliverables',
      start: '2024-01-18T17:00:00',
      end: '2024-01-18T17:00:00',
      type: 'task',
      attendees: ['Current User'],
      status: 'confirmed',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Annual Conference',
      description: 'Industry conference on business innovation',
      start: '2024-01-20T09:00:00',
      end: '2024-01-20T17:00:00',
      type: 'event',
      attendees: ['Multiple participants'],
      location: 'Convention Center',
      status: 'confirmed',
      priority: 'medium'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'task': return 'bg-yellow-100 text-yellow-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateEvent = () => {
    toast({
      title: "Create Event",
      description: "Opening event creation form...",
    });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    toast({
      title: "Edit Event",
      description: `Editing "${event.title}"...`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully deleted.",
      variant: "destructive",
    });
  };

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate > today && eventDate <= nextWeek;
  });

  return (
    <OdooMainLayout currentApp="Calendar">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Calendar</h1>
                <p className="text-odoo-gray">Manage your schedule and events</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Filter Options",
                  description: "Advanced filtering options would open here.",
                });
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90" onClick={handleCreateEvent}>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>

          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'month' | 'week' | 'day')}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[200px] text-center">
                    {currentDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TabsContent value="month" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Month View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                          const isToday = date.toDateString() === new Date().toDateString();
                          const dayEvents = events.filter(event => 
                            new Date(event.start).toDateString() === date.toDateString()
                          );
                          
                          return (
                            <div 
                              key={i} 
                              className={`p-2 min-h-[80px] border rounded ${
                                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                              } ${isToday ? 'ring-2 ring-odoo-primary' : ''}`}
                            >
                              <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                                {date.getDate()}
                              </div>
                              <div className="space-y-1 mt-1">
                                {dayEvents.slice(0, 2).map(event => (
                                  <div 
                                    key={event.id} 
                                    className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)}`}
                                    onClick={() => handleEditEvent(event)}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="week" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Week View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-center py-8">
                        Week view calendar would be displayed here with hourly time slots and events.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="day" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Day View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-center py-8">
                        Day view calendar would be displayed here with detailed hourly schedule.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Today's Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todayEvents.length > 0 ? (
                      <div className="space-y-3">
                        {todayEvents.map(event => (
                          <div key={event.id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onClick={() => handleEditEvent(event)}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-odoo-dark">{event.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatDateTime(event.start)}
                                </p>
                                {event.location && (
                                  <p className="text-sm text-gray-500">{event.location}</p>
                                )}
                              </div>
                              <Badge className={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No events for today</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingEvents.slice(0, 5).map(event => (
                          <div key={event.id} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onClick={() => handleEditEvent(event)}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-odoo-dark">{event.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatDateTime(event.start)}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge className={getEventTypeColor(event.type)} variant="secondary">
                                    {event.type}
                                  </Badge>
                                  <Badge className={getPriorityColor(event.priority)} variant="secondary">
                                    {event.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No upcoming events</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Events</span>
                        <span className="font-medium">{events.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Week</span>
                        <span className="font-medium">{upcomingEvents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meetings</span>
                        <span className="font-medium">{events.filter(e => e.type === 'meeting').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tasks</span>
                        <span className="font-medium">{events.filter(e => e.type === 'task').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default Calendar;