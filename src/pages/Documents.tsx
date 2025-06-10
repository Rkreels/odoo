
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Files, Upload, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DocumentCard from '@/components/documents/DocumentCard';
import { Document } from '@/types/documents';

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
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWorkspace, setFilterWorkspace] = useState<string>('all');

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  const handleUpload = () => {
    console.log('Upload document');
    // Future: Implement file upload
  };

  const handleView = (document: Document) => {
    console.log('View document:', document);
    // Future: Implement document viewer
  };

  const handleDownload = (document: Document) => {
    console.log('Download document:', document);
    // Future: Implement download
  };

  const handleShare = (document: Document) => {
    console.log('Share document:', document);
    // Future: Implement sharing
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkspace = filterWorkspace === 'all' || doc.workspace === filterWorkspace;
    return matchesSearch && matchesWorkspace;
  });

  const workspaces = [...new Set(documents.map(doc => doc.workspace))];

  return (
    <TopbarDashboardLayout currentApp="Documents">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Files className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Document Management</h1>
                <p className="text-odoo-gray">Organize and manage your documents</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterWorkspace} onValueChange={setFilterWorkspace}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by workspace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workspaces</SelectItem>
                {workspaces.map(workspace => (
                  <SelectItem key={workspace} value={workspace}>
                    {workspace}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Documents;
