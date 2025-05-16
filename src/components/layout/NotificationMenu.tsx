
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationMenuProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ notifications, onMarkAsRead }) => {
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md text-white hover:bg-white/10 relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-odoo-primary"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => {
                onMarkAsRead(notification.id);
                toast({
                  title: "Notification marked as read",
                  description: `Notification "${notification.title}" has been marked as read.`,
                });
              }}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <span className="text-sm text-gray-600">{notification.message}</span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">No notifications</div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;

