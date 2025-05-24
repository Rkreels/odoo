
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 55000 },
    { month: 'Jun', revenue: 67000, target: 60000 },
  ];

  const pipelineData = [
    { name: 'New', value: 12, color: '#3B82F6' },
    { name: 'Qualified', value: 8, color: '#8B5CF6' },
    { name: 'Proposition', value: 5, color: '#EAB308' },
    { name: 'Won', value: 3, color: '#10B981' },
    { name: 'Lost', value: 4, color: '#EF4444' },
  ];

  const activityData = [
    { week: 'Week 1', calls: 25, emails: 45, meetings: 8 },
    { week: 'Week 2', calls: 30, emails: 52, meetings: 12 },
    { week: 'Week 3', calls: 28, emails: 48, meetings: 10 },
    { week: 'Week 4', calls: 35, emails: 58, meetings: 15 },
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$348,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: '23.8%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Opportunities',
      value: '42',
      change: '+8',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Deal Size',
      value: '$12,450',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-odoo-dark">CRM Reports & Analytics</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {['overview', 'pipeline', 'activities', 'revenue'].map(report => (
            <Button
              key={report}
              variant={selectedReport === report ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedReport(report)}
              className={selectedReport === report ? 'bg-odoo-primary text-white' : ''}
            >
              {report.charAt(0).toUpperCase() + report.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-odoo-dark">{kpi.value}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{kpi.change}</span>
                  <span className="text-gray-500 ml-1">from last {selectedPeriod}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#8884d8" name="Calls" />
                  <Line type="monotone" dataKey="emails" stroke="#82ca9d" name="Emails" />
                  <Line type="monotone" dataKey="meetings" stroke="#ffc658" name="Meetings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Jane Doe', deals: 12, revenue: 145000 },
                  { name: 'Mike Wilson', deals: 9, revenue: 128000 },
                  { name: 'Sarah Johnson', deals: 8, revenue: 112000 },
                  { name: 'Robert Davis', deals: 6, revenue: 89000 },
                ].map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-gray-500">{performer.deals} deals closed</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(performer.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Pipeline Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Stage</th>
                    <th className="text-left p-2">Opportunities</th>
                    <th className="text-left p-2">Total Value</th>
                    <th className="text-left p-2">Avg Deal Size</th>
                    <th className="text-left p-2">Conversion Rate</th>
                    <th className="text-left p-2">Avg Time in Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { stage: 'New', count: 12, value: 480000, avgSize: 40000, conversion: '45%', avgTime: '3 days' },
                    { stage: 'Qualified', count: 8, value: 520000, avgSize: 65000, conversion: '62%', avgTime: '7 days' },
                    { stage: 'Proposition', count: 5, value: 375000, avgSize: 75000, conversion: '80%', avgTime: '12 days' },
                    { stage: 'Won', count: 3, value: 225000, avgSize: 75000, conversion: '100%', avgTime: '5 days' },
                  ].map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{row.stage}</td>
                      <td className="p-2">{row.count}</td>
                      <td className="p-2">{formatCurrency(row.value)}</td>
                      <td className="p-2">{formatCurrency(row.avgSize)}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {row.conversion}
                        </Badge>
                      </td>
                      <td className="p-2">{row.avgTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsView;
