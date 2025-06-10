
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DocumentApproval, ApprovalStep } from '@/types/documents';
import { CheckCircle, XCircle, Clock, MessageSquare, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DocumentApprovalFlowProps {
  approval: DocumentApproval;
  onApprove: (stepId: string, comments?: string) => void;
  onReject: (stepId: string, comments: string) => void;
  currentUserId: string;
}

const DocumentApprovalFlow = ({ approval, onApprove, onReject, currentUserId }: DocumentApprovalFlowProps) => {
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (step: ApprovalStep) => {
    onApprove(step.id, comments[step.id]);
    toast({
      title: "Document Approved",
      description: "Your approval has been recorded.",
    });
  };

  const handleReject = (step: ApprovalStep) => {
    if (!comments[step.id]?.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments when rejecting a document.",
        variant: "destructive",
      });
      return;
    }
    onReject(step.id, comments[step.id]);
    toast({
      title: "Document Rejected",
      description: "Your rejection has been recorded.",
      variant: "destructive",
    });
  };

  const canUserApprove = (step: ApprovalStep) => {
    return step.approver === currentUserId && step.status === 'pending';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Approval Workflow
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(approval.status)}>
            {approval.status}
          </Badge>
          <span className="text-sm text-gray-500">
            Step {approval.currentStep} of {approval.approvers.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approval.approvers.map((step, index) => (
            <div key={step.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'approved' ? 'bg-green-100' :
                    step.status === 'rejected' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {step.status === 'approved' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : step.status === 'rejected' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{step.approver}</span>
                    </div>
                    <span className="text-sm text-gray-500">Step {step.order}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(step.status)}>
                  {step.status}
                </Badge>
              </div>

              {step.comments && (
                <div className="bg-gray-50 p-3 rounded mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Comments</span>
                  </div>
                  <p className="text-sm text-gray-700">{step.comments}</p>
                </div>
              )}

              {step.approvedAt && (
                <p className="text-xs text-gray-500">
                  {step.status === 'approved' ? 'Approved' : 'Rejected'} on {step.approvedAt}
                </p>
              )}

              {canUserApprove(step) && (
                <div className="mt-3 space-y-3">
                  <Textarea
                    placeholder="Add comments (optional for approval, required for rejection)"
                    value={comments[step.id] || ''}
                    onChange={(e) => setComments(prev => ({
                      ...prev,
                      [step.id]: e.target.value
                    }))}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(step)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(step)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentApprovalFlow;
