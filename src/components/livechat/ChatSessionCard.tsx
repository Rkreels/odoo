
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, User } from 'lucide-react';
import { ChatSession } from '@/types/livechat';

interface ChatSessionCardProps {
  session: ChatSession;
  onJoin: (session: ChatSession) => void;
  onClose: (id: string) => void;
}

const ChatSessionCard: React.FC<ChatSessionCardProps> = ({ session, onJoin, onClose }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <h3 className="font-medium">{session.visitor.name}</h3>
              <Badge 
                variant={
                  session.status === 'active' ? 'default' : 
                  session.status === 'waiting' ? 'destructive' : 'secondary'
                }
                className="ml-2"
              >
                {session.status}
              </Badge>
            </div>
            
            {session.visitor.email && (
              <p className="text-xs text-gray-500 mb-1">{session.visitor.email}</p>
            )}
            
            {session.visitor.location && (
              <p className="text-xs text-gray-500 mb-2">{session.visitor.location}</p>
            )}
            
            <div className="flex space-x-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {session.duration}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                {session.messages} messages
              </div>
              {session.assignedTo && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {session.assignedTo}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            {session.status !== 'closed' && (
              <>
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={() => onJoin(session)}
                  className="text-xs"
                >
                  {session.status === 'waiting' ? 'Accept' : 'Join'}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onClose(session.id)}
                  className="text-xs"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
        
        {session.rating && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center">
              <span className="text-xs mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-3 w-3 ${
                      star <= session.rating! ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l6.18 3.245-1.179-6.873 5-4.867-6.901-1.002L10 0 6.9 6.088 0 7.09l5 4.867-1.179 6.873L10 15.585z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSessionCard;
