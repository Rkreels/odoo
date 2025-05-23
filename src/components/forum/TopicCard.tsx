
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, User, Calendar } from 'lucide-react';
import { ForumTopic } from '@/types/forum';

interface TopicCardProps {
  topic: ForumTopic;
  onView: (topic: ForumTopic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onView }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 
              className="font-medium text-lg mb-1 hover:text-odoo-primary cursor-pointer"
              onClick={() => onView(topic)}
            >
              {topic.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
            
            <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {topic.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {topic.createdAt}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                {topic.replies} replies
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {topic.views} views
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={topic.status === 'active' ? 'default' : topic.status === 'locked' ? 'secondary' : 'outline'}>
                {topic.status}
              </Badge>
              <Badge variant="outline">{topic.category}</Badge>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(topic)}
          >
            View
          </Button>
        </div>
        
        {topic.lastReply && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            <span>Last reply by <strong>{topic.lastReply.author}</strong> on {topic.lastReply.date}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicCard;
