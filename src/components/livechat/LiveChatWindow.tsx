
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X } from 'lucide-react';
import { ChatSession, ChatMessage } from '@/types/livechat';

interface LiveChatWindowProps {
  session: ChatSession | null;
  onClose: () => void;
  onSendMessage: (sessionId: string, message: string) => void;
}

const LiveChatWindow: React.FC<LiveChatWindowProps> = ({ 
  session, 
  onClose, 
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  if (!session) return null;
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sessionId: session.id,
        sender: 'agent',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setMessages([...messages, agentMessage]);
      onSendMessage(session.id, newMessage);
      setNewMessage('');
      
      // Simulate visitor response
      setTimeout(() => {
        const visitorMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sessionId: session.id,
          sender: 'visitor',
          content: 'Thank you for your response!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        
        setMessages(prevMessages => [...prevMessages, visitorMessage]);
      }, 2000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-lg z-50 flex flex-col">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm">{session.visitor.name}</CardTitle>
            <p className="text-xs text-gray-500">{session.visitor.location || 'Unknown location'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-gray-100 rounded-lg p-3 text-sm">
          <p className="text-gray-600">Chat started at {session.startedAt}</p>
        </div>
        
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">No messages yet</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg px-3 py-2 max-w-[75%] ${
                  message.sender === 'agent' 
                    ? 'bg-odoo-primary text-white' 
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <div className="flex w-full items-center">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 mx-2"
          />
          <Button 
            size="sm"
            disabled={!newMessage.trim()} 
            onClick={handleSendMessage}
            className="bg-odoo-primary hover:bg-odoo-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LiveChatWindow;
