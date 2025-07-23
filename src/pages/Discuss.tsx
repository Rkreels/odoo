
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { MessageSquareText, PlusCircle, Users, Hash, Lock, Globe, Video, Phone, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChannelList from '@/components/discuss/ChannelList';
import ChatArea from '@/components/discuss/ChatArea';
import { Channel, Message } from '@/types/discuss';
import { LOCAL_STORAGE_KEYS } from '@/lib/localStorageUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';


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
  const [activeTab, setActiveTab] = useState('channels');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [filterType, setFilterType] = useState('all');

  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'public' | 'private'>('public');
  const [newChannelDescription, setNewChannelDescription] = useState('');


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
      description: newChannelDescription.trim() || `Discussions for ${newChannelName.trim()}`,
      type: newChannelType,
      members: ['Current User'],
      unreadCount: 0,
    };
    setChannels(prev => [...prev, newChannel]);
    setActiveChannelId(newChannel.id);
    setIsCreateChannelModalOpen(false);
    setNewChannelName('');
    setNewChannelDescription('');
    setNewChannelType('public');
    toast({
      title: "Channel created",
      description: `Channel #${newChannel.name} has been created successfully.`,
    });
  };
  
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    // Reset unread count for this channel (simplified)
    setChannels(prevChannels => prevChannels.map(ch => 
      ch.id === channelId ? {...ch, unreadCount: 0} : ch
    ));
  };


  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || channel.type === filterType;
    return matchesSearch && matchesType;
  });

  const channelFilters = [
    { label: 'All Channels', value: 'all', count: channels.length },
    { label: 'Public', value: 'public', count: channels.filter(c => c.type === 'public').length },
    { label: 'Private', value: 'private', count: channels.filter(c => c.type === 'private').length }
  ];

  const totalMessages = messages.length;
  const activeChannels = channels.length;
  const publicChannels = channels.filter(c => c.type === 'public').length;
  const privateChannels = channels.filter(c => c.type === 'private').length;

  const renderChannelsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-4">Channel</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Members</div>
        <div className="col-span-2">Messages</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {filteredChannels.map(channel => {
        const channelMessages = messages.filter(m => m.channelId === channel.id);
        return (
          <div key={channel.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
            <div className="col-span-4">
              <div className="flex items-center space-x-2">
                {channel.type === 'public' ? (
                  <Hash className="h-4 w-4 text-gray-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-600" />
                )}
                <div>
                  <p className="font-medium text-sm">#{channel.name}</p>
                  <p className="text-xs text-gray-600">{channel.description}</p>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <Badge variant={channel.type === 'public' ? 'default' : 'secondary'}>
                {channel.type}
              </Badge>
            </div>
            <div className="col-span-2">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span className="text-sm">{channel.members.length}</span>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm">{channelMessages.length}</p>
            </div>
            <div className="col-span-2">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => setActiveChannelId(channel.id)}>
                  Join
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Discuss">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'channels' ? 'Channels' : activeTab === 'chat' ? 'Chat' : 'Settings'}
          subtitle={
            activeTab === 'channels' ? 'Manage and browse discussion channels' :
            activeTab === 'chat' ? 'Team communication and messaging' :
            'Discussion settings and preferences'
          }
          searchPlaceholder="Search channels..."
          onSearch={setSearchTerm}
          onCreateNew={() => setIsCreateChannelModalOpen(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={channelFilters}
          selectedFilter={filterType}
          onFilterChange={setFilterType}
          recordCount={filteredChannels.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="channels" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{activeChannels}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Public Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{publicChannels}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Private Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{privateChannels}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <MessageSquareText className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{totalMessages}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderChannelsList()}
              
              {filteredChannels.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquareText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No channels found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex">
            <div className="flex-1 flex">
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
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desktop Notifications</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile Push</span>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Message History</span>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Export</span>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Auth</span>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span className="text-sm">Video Calls</span>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Voice Calls</span>
                    </div>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Default Language</span>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time Zone</span>
                    <Select defaultValue="utc">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
              <label htmlFor="channel-description" className="text-right col-span-1">
                Description
              </label>
              <Textarea
                id="channel-description"
                value={newChannelDescription}
                onChange={(e) => setNewChannelDescription(e.target.value)}
                className="col-span-3"
                placeholder="Channel purpose and guidelines"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="channel-type" className="text-right col-span-1">
                Type
              </label>
              <Select value={newChannelType} onValueChange={(value) => setNewChannelType(value as 'public' | 'private')}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can join</SelectItem>
                  <SelectItem value="private">Private - Invitation only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateChannelModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChannel} className="bg-odoo-primary hover:bg-odoo-primary/90">Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OdooMainLayout>
  );
};

export default Discuss;
