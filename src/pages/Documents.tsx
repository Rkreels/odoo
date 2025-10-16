
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Files, Upload, Plus, Search, Filter, Eye, Edit, Share, Trash, Download, FolderPlus, Users, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DocumentCard from '@/components/documents/DocumentCard';
import { Document } from '@/types/documents';
import { toast } from '@/components/ui/use-toast';

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'presentation',
    size: 2048576,
    owner: 'John Doe',
    createdAt: '2024-01-15',
    modifiedAt: '2024-01-16',
    workspace: 'Projects',
    tags: ['proposal', 'project'],
    isShared: true,
    status: 'published',
    version: 1,
    category: 'Business',
    checksum: 'abc123',
    mimeType: 'application/pdf',
    isLocked: false,
    accessLevel: 'read',
    collaborators: [],
    versions: [],
    activities: []
  },
  {
    id: '2',
    name: 'Meeting Notes.docx',
    type: 'other',
    size: 512000,
    owner: 'Sarah Smith',
    createdAt: '2024-01-14',
    modifiedAt: '2024-01-14',
    workspace: 'Meetings',
    tags: ['notes', 'meeting'],
    isShared: false,
    status: 'draft',
    version: 1,
    category: 'Documentation',
    checksum: 'def456',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    isLocked: false,
    accessLevel: 'write',
    collaborators: [],
    versions: [],
    activities: []
  },
  {
    id: '3',
    name: 'Financial Report.xlsx',
    type: 'spreadsheet',
    size: 1024000,
    owner: 'Mike Wilson',
    createdAt: '2024-01-10',
    modifiedAt: '2024-01-12',
    workspace: 'Finance',
    tags: ['finance', 'report'],
    isShared: true,
    status: 'approved',
    version: 2,
    category: 'Finance',
    checksum: 'ghi789',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    isLocked: false,
    accessLevel: 'read',
    collaborators: [],
    versions: [],
    activities: []
  },
];

const Documents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWorkspace, setFilterWorkspace] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    // Auth check handled by context
  }, []);

  const handleUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          const newDoc: Document = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: file.type.includes('pdf') ? 'other' : file.type.includes('image') ? 'image' : 'other',
            size: file.size,
            owner: 'Current User',
            createdAt: new Date().toISOString().split('T')[0],
            modifiedAt: new Date().toISOString().split('T')[0],
            workspace: 'Uploads',
            tags: [],
            isShared: false,
            status: 'draft',
            version: 1,
            category: 'General',
            checksum: Math.random().toString(36),
            mimeType: file.type,
            isLocked: false,
            accessLevel: 'write',
            collaborators: [],
            versions: [],
            activities: []
          };
          setDocuments(prev => [newDoc, ...prev]);
        });
      }
    };
    fileInput.click();
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleDownload = (doc: Document) => {
    // Simulate download
    const link = window.document.createElement('a');
    link.download = doc.name;
    link.click();
  };

  const handleShare = (document: Document) => {
    const updatedDoc = { ...document, isShared: !document.isShared };
    setDocuments(prev => prev.map(doc => doc.id === document.id ? updatedDoc : doc));
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleApprove = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'approved' } : doc
    ));
  };

  const handleReject = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'archived' as const } : doc
    ));
  };

  const handleCreateDocument = (docData: any) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      ...docData,
      owner: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      modifiedAt: new Date().toISOString().split('T')[0],
      version: 1,
      checksum: Math.random().toString(36),
      isLocked: false,
      collaborators: [],
      versions: [],
      activities: []
    };
    setDocuments(prev => [newDoc, ...prev]);
    setShowCreateDocument(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesWorkspace = filterWorkspace === 'all' || doc.workspace === filterWorkspace;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesWorkspace && matchesStatus;
  });

  const documentFilters = [
    { label: 'All Documents', value: 'all', count: documents.length },
    { label: 'Draft', value: 'draft', count: documents.filter(d => d.status === 'draft').length },
    { label: 'Published', value: 'published', count: documents.filter(d => d.status === 'published').length },
    { label: 'Approved', value: 'approved', count: documents.filter(d => d.status === 'approved').length },
    { label: 'Shared', value: 'shared', count: documents.filter(d => d.isShared).length }
  ];

  const workspaces = [...new Set(documents.map(doc => doc.workspace))];
  const totalDocuments = documents.length;
  const sharedDocuments = documents.filter(d => d.isShared).length;
  const approvedDocuments = documents.filter(d => d.status === 'approved').length;
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

  const renderDocumentsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Document</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Size</div>
        <div className="col-span-2">Workspace</div>
        <div className="col-span-1">Modified</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredDocuments.map(document => (
        <div key={document.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              {document.isShared && <Share className="h-3 w-3 text-blue-500" />}
              {document.isLocked && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
              <div>
                <p className="font-medium text-sm">{document.name}</p>
                <p className="text-xs text-gray-600">v{document.version}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{document.owner}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{document.type}</Badge>
          </div>
          <div className="col-span-1">
            <Badge variant={
              document.status === 'approved' ? 'default' : 
              document.status === 'published' ? 'secondary' :
              document.status === 'archived' ? 'destructive' : 'outline'
            }>
              {document.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{(document.size / 1024).toFixed(1)} KB</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{document.workspace}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{document.modifiedAt}</p>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">⋮</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem onClick={() => handleView(document)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload(document)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare(document)}>
                  <Share className="h-4 w-4 mr-2" />
                  {document.isShared ? 'Unshare' : 'Share'}
                </DropdownMenuItem>
                {document.status === 'draft' && (
                  <>
                    <DropdownMenuItem onClick={() => handleApprove(document.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReject(document.id)}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(document.id)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <OdooMainLayout currentApp="Documents">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'documents' ? 'Document Management' : activeTab === 'workspaces' ? 'Workspaces' : 'Approvals'}
          subtitle={
            activeTab === 'documents' ? 'Organize and manage your documents' :
            activeTab === 'workspaces' ? 'Manage document workspaces and permissions' :
            'Review and approve document changes'
          }
          searchPlaceholder="Search documents..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateDocument(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={documentFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredDocuments.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="documents" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Files className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalDocuments}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Shared Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Share className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{sharedDocuments}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{approvedDocuments}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Files className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{(totalSize / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="p-6 bg-white border-b">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Workspace:</label>
                <Select value={filterWorkspace} onValueChange={setFilterWorkspace}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Workspaces</SelectItem>
                    {workspaces.map(workspace => (
                      <SelectItem key={workspace} value={workspace}>{workspace}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderDocumentsList() : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDocuments.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onView={handleView}
                      onDownload={handleDownload}
                      onShare={handleShare}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-8">
                  <Files className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workspaces" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map(workspace => {
                const workspaceDocs = documents.filter(d => d.workspace === workspace);
                const workspaceSize = workspaceDocs.reduce((sum, doc) => sum + doc.size, 0);
                return (
                  <Card key={workspace}>
                    <CardHeader>
                      <CardTitle className="text-lg">{workspace}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Documents:</span>
                          <span className="font-medium">{workspaceDocs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Size:</span>
                          <span className="font-medium">{(workspaceSize / 1024).toFixed(1)} KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Shared:</span>
                          <span className="font-medium">{workspaceDocs.filter(d => d.isShared).length}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-3 w-3 mr-1" />
                          Manage Access
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="flex-1 p-6">
            <div className="space-y-4">
              {documents.filter(d => d.status === 'draft').map(document => (
                <Card key={document.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{document.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">by {document.owner} • {document.workspace}</p>
                      </div>
                      <Badge variant="outline">Pending Approval</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p>Size: {(document.size / 1024).toFixed(1)} KB</p>
                        <p>Created: {document.createdAt}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(document)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleApprove(document.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(document.id)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Archive
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {documents.filter(d => d.status === 'draft').length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents pending approval.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Document Dialog */}
        <Dialog open={showCreateDocument} onOpenChange={setShowCreateDocument}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Document name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map(workspace => (
                    <SelectItem key={workspace} value={workspace}>{workspace}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Document description (optional)" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDocument(false)}>Cancel</Button>
              <Button onClick={() => handleCreateDocument({
                name: 'New Document',
                type: 'document',
                size: 0,
                workspace: 'General',
                tags: [],
                isShared: false,
                status: 'draft',
                category: 'General',
                mimeType: 'text/plain',
                accessLevel: 'write'
              })}>
                Create Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OdooMainLayout>
  );
};

export default Documents;
