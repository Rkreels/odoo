
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, FileText } from 'lucide-react';
import { Expense } from '@/types/expenses';

interface ExpenseCardProps {
  expense: Expense;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onApprove, onReject, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{expense.description}</h3>
          <Badge className={getStatusColor(expense.status)} variant="outline">
            {expense.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="font-medium">${expense.amount}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {expense.employee}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {expense.date}
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {expense.category}
          </div>
        </div>
        
        {expense.status === 'pending' && (
          <div className="flex space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onView(expense)}>
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onApprove(expense.id)}
              className="text-green-600 hover:text-green-700"
            >
              Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onReject(expense.id)}
              className="text-red-600 hover:text-red-700"
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
