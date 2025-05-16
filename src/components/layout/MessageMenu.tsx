
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  read: boolean;
}

interface MessageMenuProps {
  messages: Message[];
  onMarkAsRead: (id: string) => void;
}

const MessageMenu: React.FC<MessageMenuProps> = ({ messages, onMarkAsRead }) => {
  const unreadMessages = messages.filter(m => !m.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md text-white hover:bg-white/10 relative">
          <MessageSquare className="h-5 w-5" />
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-odoo-primary"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messages.length > 0 ? (
          messages.map((message) => (
            <DropdownMenuItem 
              key={message.id} 
              className={`cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
              onClick={() => {
                onMarkAsRead(message.id);
                 toast({
                  title: "Message marked as read",
                  description: `Message from "${message.sender}" has been marked as read.`,
                });
              }}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{message.sender}</span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <span className="text-sm text-gray-600 truncate">{message.message}</span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">No messages</div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
          View all messages
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageMenu;

