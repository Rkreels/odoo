
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Product, LifecyclePhase, Milestone, QualityGate } from '@/types/plm';
import { 
  Target, Calendar, CheckCircle, Clock, AlertTriangle, 
  TrendingUp, DollarSign, Users, FileText, Settings
} from 'lucide-react';

interface ProductLifecycleViewProps {
  product: Product;
  onPhaseUpdate: (phaseId: string, updates: Partial<LifecyclePhase>) => void;
  onMilestoneUpdate: (milestoneId: string, status: string) => void;
  onGateReview: (gateId: string, status: 'passed' | 'failed', comments: string) => void;
}

const ProductLifecycleView = ({ product, onPhaseUpdate, onMilestoneUpdate, onGateReview }: ProductLifecycleViewProps) => {
  const [activeTab, setActiveTab] = useState<'phases' | 'milestones' | 'gates' | 'metrics'>('phases');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'passed': case 'production': case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress': case 'testing': case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'delayed': case 'failed': case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'planned': case 'pending': case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'delayed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateProgress = () => {
    const completedPhases = product.lifecycle.phases.filter(p => 
      p.endDate && new Date(p.endDate) <= new Date()
    ).length;
    return (completedPhases / product.lifecycle.phases.length) * 100;
  };

  const renderPhases = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Lifecycle Phases</h3>
        <Badge className={getStatusColor(product.status)}>
          {product.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Overall Progress</span>
          <span>{Math.round(calculateProgress())}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      <div className="grid gap-4">
        {product.lifecycle.phases.map((phase, index) => (
          <Card key={phase.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPhaseIcon(phase.endDate ? 'completed' : 'in_progress')}
                  <div>
                    <h4 className="font-medium">{phase.name}</h4>
                    <p className="text-sm text-gray-600">Phase {index + 1}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(phase.endDate ? 'completed' : 'in_progress')}>
                  {phase.endDate ? 'Completed' : 'In Progress'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    Start Date
                  </div>
                  <p className="text-sm font-medium">{phase.startDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    End Date
                  </div>
                  <p className="text-sm font-medium">
                    {phase.endDate || 'Ongoing'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="h-3 w-3" />
                    Budget
                  </div>
                  <p className="text-sm font-medium">${phase.budget.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    Responsible
                  </div>
                  <p className="text-sm font-medium">{phase.responsible}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Deliverables</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {phase.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">{deliverable.name}</span>
                      </div>
                      <Badge size="sm" className={getStatusColor(deliverable.status)}>
                        {deliverable.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {index < product.lifecycle.phases.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Milestones</h3>
      <div className="grid gap-3">
        {product.lifecycle.milestones.map((milestone) => (
          <Card key={milestone.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium">{milestone.name}</h4>
                  {milestone.critical && (
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  )}
                </div>
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Target Date</span>
                  <p className="text-sm font-medium">{milestone.targetDate}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Actual Date</span>
                  <p className="text-sm font-medium">
                    {milestone.actualDate || 'Pending'}
                  </p>
                </div>
              </div>
              {milestone.status === 'in_progress' && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onMilestoneUpdate(milestone.id, 'completed')}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMilestoneUpdate(milestone.id, 'delayed')}
                  >
                    Mark Delayed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderQualityGates = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Quality Gates</h3>
      <div className="grid gap-3">
        {product.lifecycle.gates.map((gate) => (
          <Card key={gate.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{gate.name}</h4>
                <Badge className={getStatusColor(gate.status)}>
                  {gate.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {gate.criteria.map((criteria) => (
                  <div key={criteria.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{criteria.requirement}</span>
                    <Badge size="sm" className={getStatusColor(criteria.status)}>
                      {criteria.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {gate.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onGateReview(gate.id, 'passed', '')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Pass Gate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onGateReview(gate.id, 'failed', '')}
                  >
                    Fail Gate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lifecycle Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time to Market</span>
            </div>
            <p className="text-2xl font-bold">{product.lifecycle.metrics.timeToMarket} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Development Cost</span>
            </div>
            <p className="text-2xl font-bold">${product.lifecycle.metrics.developmentCost.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Quality Score</span>
            </div>
            <p className="text-2xl font-bold">{product.lifecycle.metrics.qualityScore}%</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Completion Progress</span>
          </div>
          <Progress value={product.lifecycle.metrics.completionPercentage} className="h-3" />
          <div className="flex justify-between text-sm mt-2">
            <span>Progress</span>
            <span>{product.lifecycle.metrics.completionPercentage}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Product Lifecycle Management
          </CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Product: {product.name} (v{product.version})
            </span>
            <Badge className={getStatusColor(product.status)}>
              {product.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'phases', label: 'Phases', icon: Target },
          { key: 'milestones', label: 'Milestones', icon: Calendar },
          { key: 'gates', label: 'Quality Gates', icon: CheckCircle },
          { key: 'metrics', label: 'Metrics', icon: TrendingUp }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(key as any)}
            className="flex-1"
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      <div>
        {activeTab === 'phases' && renderPhases()}
        {activeTab === 'milestones' && renderMilestones()}
        {activeTab === 'gates' && renderQualityGates()}
        {activeTab === 'metrics' && renderMetrics()}
      </div>
    </div>
  );
};

export default ProductLifecycleView;
