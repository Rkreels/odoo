
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Users, Plus } from 'lucide-react';
import { Channel } from '@/types/discuss';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: () => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  activeChannelId,
  onChannelSelect,
  onCreateChannel,
}) => {
  return (
    <div className="w-64 bg-gray-50 border-r p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-odoo-dark">Channels</h3>
        <Button size="sm" variant="outline" onClick={onCreateChannel}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${
              activeChannelId === channel.id ? 'bg-odoo-primary/10 border-l-2 border-odoo-primary' : ''
            }`}
            onClick={() => onChannelSelect(channel.id)}
          >
            {channel.type === 'public' ? (
              <Hash className="h-4 w-4 mr-2 text-gray-500" />
            ) : (
              <Users className="h-4 w-4 mr-2 text-gray-500" />
            )}
            <span className="flex-1 text-sm">{channel.name}</span>
            {channel.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {channel.unreadCount}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;
