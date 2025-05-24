
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, DollarSign, Users, Target, Download, Filter
} from 'lucide-react';
import { Opportunity, OpportunityStage } from '@/types/crm';
import { getStoredOpportunities } from '@/lib/localStorageUtils';

const ReportsView = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // This filter is not fully implemented yet
  const [selectedReportType, setSelectedReportType] = useState('overview'); // This filter can be used to show/hide sections

  useEffect(() => {
    setOpportunities(getStoredOpportunities());
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // --- Dynamic Data Calculations ---
  const totalRevenueAllTime = opportunities
    .filter(opp => opp.stage === 'Won')
    .reduce((sum, opp) => sum + opp.expectedRevenue, 0);
  
  const activeOpportunitiesCount = opportunities
    .filter(opp => opp.stage !== 'Won' && opp.stage !== 'Lost')
    .length;

  const averageDealSize = activeOpportunitiesCount > 0 
    ? opportunities
        .filter(opp => opp.stage !== 'Won' && opp.stage !== 'Lost')
        .reduce((sum, opp) => sum + opp.expectedRevenue, 0) / activeOpportunitiesCount
    : 0;

  // Placeholder for conversion rate, more complex to calculate accurately without lead data / stage history
  const conversionRate = opportunities.length > 0 ? 
    (opportunities.filter(opp => opp.stage === 'Won').length / opportunities.length * 100).toFixed(1) + '%'
    : '0%';


  const kpiCards = [
    {
      title: 'Total Won Revenue',
      value: formatCurrency(totalRevenueAllTime),
      change: '+12.5%', // Placeholder
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversion Rate (to Won)',
      value: conversionRate,
      change: '+3.2%', // Placeholder
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Opportunities',
      value: activeOpportunitiesCount.toString(),
      change: '+8', // Placeholder
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Average Deal Size (Active)',
      value: formatCurrency(averageDealSize),
      change: '+5.1%', // Placeholder
      trend: 'up',
      icon: Users, // Changed icon to Users, perhaps DollarSign is better
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Revenue Data (Monthly Won Opportunities for last 6 months - simplified)
  // This requires more sophisticated date handling for a real report.
  // For now, let's use a simplified placeholder or group by stage.
  const monthlyRevenueData = [ /* Placeholder, would need real date filtering */
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    // ... more months
  ];
  
  const pipelineStageColors: { [key: string]: string } = {
    'New': '#3B82F6', 
    'Qualified': '#8B5CF6', 
    'Proposition': '#EAB308',
    'Won': '#10B981', 
    'Lost': '#EF4444'
  };

  const pipelineDistributionData = Object.entries(
    opportunities.reduce((acc, opp) => {
      acc[opp.stage] = (acc[opp.stage] || 0) + 1;
      return acc;
    }, {} as Record<OpportunityStage, number>)
  ).map(([name, value]) => ({ name, value, color: pipelineStageColors[name] || '#A0AEC0' }));


  // Activity Data (Placeholder)
  const activityData = [
    { week: 'Week 1', calls: 25, emails: 45, meetings: 8 },
    // ... more weeks
  ];
  
  // Detailed Pipeline Analysis (Dynamic)
  const detailedPipelineAnalysis = (Object.keys(pipelineStageColors) as OpportunityStage[]).map(stageName => {
    const stageOpps = opportunities.filter(opp => opp.stage === stageName);
    const totalValue = stageOpps.reduce((sum, opp) => sum + opp.expectedRevenue, 0);
    const count = stageOpps.length;
    // Conversion rate to this stage and avg time in stage are complex and need historical data, using placeholders
    return {
      stage: stageName,
      count: count,
      value: totalValue,
      avgSize: count > 0 ? totalValue / count : 0,
      conversion: stageName === 'Won' ? '100%' : `${Math.round(Math.random() * 50 + 20)}%`, // Placeholder
      avgTime: `${Math.round(Math.random() * 10 + 2)} days` // Placeholder
    };
  });


  const handleExport = () => {
    // Basic CSV export - can be expanded
    const headers = ["Opportunity", "Customer", "Expected Revenue", "Probability", "Stage", "Expected Closing", "Assigned To"];
    const csvContent = [
      headers.join(','),
      ...opportunities.map(opp => [
        `"${opp.name.replace(/"/g, '""')}"`,
        `"${opp.customer.replace(/"/g, '""')}"`,
        opp.expectedRevenue,
        opp.probability,
        opp.stage,
        opp.expectedClosing,
        `"${opp.assignedTo.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "opportunities_report.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all_time">All Time</option>
              <option value="month">This Month (filter not implemented)</option>
              <option value="quarter">This Quarter (filter not implemented)</option>
              <option value="year">This Year (filter not implemented)</option>
            </select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filters (coming soon)
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Report type selection can be added here if needed */}
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
                {kpi.change && ( /* Only show trend if change is defined */
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">{kpi.change}</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart - Placeholder for now */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Won Revenue (Placeholder)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2">Note: Monthly revenue chart is using placeholder data. Real implementation requires date-based filtering of opportunities.</p>
            </CardContent>
          </Card>

          {/* Pipeline Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pipelineDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pipelineDistributionData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, entry) => [`${value} opportunities`, entry.payload.name]}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Trends - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends (Placeholder)</CardTitle>
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
               <p className="text-xs text-gray-500 mt-2">Note: Activity trends are using placeholder data. This requires an Activities module with local storage.</p>
            </CardContent>
          </Card>

          {/* Top Performers - Placeholder for now */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers (Placeholder)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[ /* Placeholder data */
                  { name: 'Jane Doe', deals: 5, revenue: 75000 },
                  { name: 'Mike Wilson', deals: 3, revenue: 120000 },
                ].map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center bg-odoo-primary-light text-odoo-primary">
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
               <p className="text-xs text-gray-500 mt-2">Note: Top performers are using placeholder data. This requires tracking sales by user.</p>
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
                    <th className="text-left p-2 font-semibold text-gray-700">Stage</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Opportunities</th>
                    <th className="text-right p-2 font-semibold text-gray-700">Total Value</th>
                    <th className="text-right p-2 font-semibold text-gray-700">Avg Deal Size</th>
                    <th className="text-center p-2 font-semibold text-gray-700">Conversion Rate (Placeholder)</th>
                    <th className="text-center p-2 font-semibold text-gray-700">Avg Time in Stage (Placeholder)</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedPipelineAnalysis.map((row) => (
                    <tr key={row.stage} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium text-odoo-dark">{row.stage}</td>
                      <td className="p-2 text-center">{row.count}</td>
                      <td className="p-2 text-right">{formatCurrency(row.value)}</td>
                      <td className="p-2 text-right">{formatCurrency(row.avgSize)}</td>
                      <td className="p-2 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          {row.conversion}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">{row.avgTime}</td>
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
