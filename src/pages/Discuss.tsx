
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessageSquareText, PlusCircle } from 'lucide-react';
import ChannelList from '@/components/discuss/ChannelList';
import ChatArea from '@/components/discuss/ChatArea';
import { Channel, Message } from '@/types/discuss';
import { LOCAL_STORAGE_KEYS } from '@/lib/localStorageUtils'; // Import new constants
import { Button } from '@/components/ui/button'; // For create channel button
import { Input } from '@/components/ui/input'; // For new channel name
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // For new channel modal


const initialChannelsData: Channel[] = [
  {
    id: '1',
    name: 'general',
    description: 'General discussion and company announcements',
    type: 'public',
    members: ['user1', 'user2', 'user3'], // In a real app, these would be actual user IDs
    unreadCount: 0, // Will be dynamically calculated or managed
  },
  {
    id: '2',
    name: 'marketing-updates',
    description: 'Updates and discussions for the marketing team',
    type: 'public',
    members: ['user1', 'user2'],
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'project-alpha',
    description: 'Private channel for Project Alpha discussions',
    type: 'private',
    members: ['user1', 'user3'],
    unreadCount: 0,
  },
];

const initialMessagesData: Message[] = [
  {
    id: 'msg1',
    channelId: '1',
    sender: 'John Doe',
    content: 'Welcome everyone to the #general channel! Feel free to ask questions here.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 2 hours ago
  },
  {
    id: 'msg2',
    channelId: '1',
    sender: 'Sarah Smith',
    content: 'Thanks John! Looking forward to collaborating with everyone.',
    timestamp: new Date(Date.now() - 1000 * 60 * 58).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 58 mins ago
  },
   {
    id: 'msg3',
    channelId: '2',
    sender: 'Mike Wilson',
    content: 'The new marketing campaign visuals are ready for review.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 30 mins ago
  },
];

const getStoredChannels = (): Channel[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CHANNELS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_STORAGE_KEYS.CHANNELS, JSON.stringify(initialChannelsData));
  return initialChannelsData;
};

const storeChannels = (channels: Channel[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
};

const getStoredMessages = (): Message[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.MESSAGES);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessagesData));
  return initialMessagesData;
};

const storeMessages = (messages: Message[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};


const Discuss = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>(getStoredChannels);
  const [messages, setMessages] = useState<Message[]>(getStoredMessages);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'public' | 'private'>('public');


  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    // Set initial active channel if none is set and channels exist
    if (!activeChannelId && channels.length > 0) {
      setActiveChannelId(channels[0].id);
    }
  }, [navigate, channels, activeChannelId]);

  useEffect(() => {
    storeChannels(channels);
  }, [channels]);

  useEffect(() => {
    storeMessages(messages);
  }, [messages]);
  

  const activeChannel = channels.find(channel => channel.id === activeChannelId);
  const channelMessages = messages.filter(message => message.channelId === activeChannelId).sort((a,b) => {
      // Basic time sort, assumes HH:MM AM/PM format or consistent ISO strings
      // A more robust solution would parse Date objects
      return new Date(`1/1/2000 ${a.timestamp}`).getTime() - new Date(`1/1/2000 ${b.timestamp}`).getTime();
  });

  const handleSendMessage = (content: string) => {
    if (!activeChannelId || !content.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      channelId: activeChannelId,
      sender: 'Current User', // Replace with actual user info later
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: `Discussions for ${newChannelName.trim()}`,
      type: newChannelType,
      members: ['Current User'], // Add current user
      unreadCount: 0,
    };
    setChannels(prev => [...prev, newChannel]);
    setActiveChannelId(newChannel.id); // Switch to new channel
    setIsCreateChannelModalOpen(false);
    setNewChannelName('');
    setNewChannelType('public');
  };
  
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    // Reset unread count for this channel (simplified)
    setChannels(prevChannels => prevChannels.map(ch => 
      ch.id === channelId ? {...ch, unreadCount: 0} : ch
    ));
  };


  return (
    <TopbarDashboardLayout currentApp="Discuss">
      <div className="h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] flex"> {/* Adjusted height for topbar & secondary nav */}
        <ChannelList
          channels={channels}
          activeChannelId={activeChannelId}
          onChannelSelect={handleSelectChannel}
          onCreateChannel={() => setIsCreateChannelModalOpen(true)}
        />
        <div className="flex-1 flex flex-col bg-white border-l border-gray-200">
          {activeChannel ? (
            <ChatArea
              channel={activeChannel}
              messages={channelMessages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquareText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Discuss</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Select a channel from the list to start chatting, or create a new channel to begin a new conversation.
              </p>
              <Button onClick={() => setIsCreateChannelModalOpen(true)} className="bg-odoo-primary hover:bg-odoo-primary/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Channel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Channel Modal */}
      <Dialog open={isCreateChannelModalOpen} onOpenChange={setIsCreateChannelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="channel-name" className="text-right col-span-1">
                Name
              </label>
              <Input
                id="channel-name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., project-discussion"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="channel-type" className="text-right col-span-1">
                Type
              </label>
              <select 
                id="channel-type"
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value as 'public' | 'private')}
                className="col-span-3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateChannelModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChannel} className="bg-odoo-primary hover:bg-odoo-primary/90">Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TopbarDashboardLayout>
  );
};

export default Discuss;
