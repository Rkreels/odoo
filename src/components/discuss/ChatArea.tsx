
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Message, Channel } from '@/types/discuss';

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ channel, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Channel Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-odoo-dark"># {channel.name}</h2>
        <p className="text-sm text-gray-500">{channel.description}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex space-x-3">
            <div className="w-8 h-8 bg-odoo-primary rounded-full flex items-center justify-center text-white text-sm">
              {message.sender.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{message.sender}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder={`Message #${channel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSendMessage}
            className="bg-odoo-primary hover:bg-odoo-primary/90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
