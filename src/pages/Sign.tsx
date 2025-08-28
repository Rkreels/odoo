
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import { FileSignature, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignatureRequest } from '@/types/sign';
import SignatureRequestCard from '@/components/sign/SignatureRequestCard';
import { toast } from "@/components/ui/use-toast";

const Sign = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SignatureRequest[]>([
    {
      id: '1',
      title: 'Sales Agreement',
      documentName: 'SalesAgreement_2025.pdf',
      documentUrl: '/documents/sales-agreement-2025.pdf',
      recipients: [
        { 
          id: '1',
          name: 'John Smith', 
          email: 'john@example.com', 
          role: 'signer',
          order: 1,
          signed: true, 
          signedAt: '2025-05-15',
          isRequired: true,
          language: 'en'
        },
        { 
          id: '2',
          name: 'Alice Brown', 
          email: 'alice@example.com', 
          role: 'signer',
          order: 2,
          signed: false,
          isRequired: true,
          language: 'en'
        },
      ],
      createdBy: 'Current User',
      createdAt: '2025-05-10',
      status: 'sent',
      expiresAt: '2025-06-10',
      settings: {
        allowDecline: true,
        requireAccessCode: false,
        enableReminders: true,
        allowDelegation: false,
        enableAuditTrail: true,
        retentionPeriod: 365,
        language: 'en',
        timezone: 'UTC'
      },
      fields: [],
      audit: [],
      reminders: {
        enabled: true,
        firstReminder: 3,
        recurringReminder: 7,
        finalReminder: 1
      },
      security: {
        requireIdVerification: false,
        enableGeolocation: false,
        requireBiometric: false,
        encryptionLevel: 'standard',
        watermarkPages: false,
        preventPrinting: false,
        preventDownload: false,
        sessionTimeout: 30
      },
      metadata: {
        tags: ['sales', 'agreement'],
        category: 'contract',
        priority: 'medium',
        department: 'sales',
        customFields: {}
      }
    },
    {
      id: '2',
      title: 'Employment Contract',
      documentName: 'EmploymentContract_Adams.pdf',
      documentUrl: '/documents/employment-contract-adams.pdf',
      recipients: [
        { 
          id: '3',
          name: 'Sarah Adams', 
          email: 'sarah@example.com', 
          role: 'signer',
          order: 1,
          signed: false,
          isRequired: true,
          language: 'en'
        },
      ],
      createdBy: 'Current User',
      createdAt: '2025-05-19',
      status: 'draft',
      settings: {
        allowDecline: true,
        requireAccessCode: false,
        enableReminders: true,
        allowDelegation: false,
        enableAuditTrail: true,
        retentionPeriod: 365,
        language: 'en',
        timezone: 'UTC'
      },
      fields: [],
      audit: [],
      reminders: {
        enabled: true,
        firstReminder: 3,
        recurringReminder: 7,
        finalReminder: 1
      },
      security: {
        requireIdVerification: false,
        enableGeolocation: false,
        requireBiometric: false,
        encryptionLevel: 'standard',
        watermarkPages: false,
        preventPrinting: false,
        preventDownload: false,
        sessionTimeout: 30
      },
      metadata: {
        tags: ['employment', 'hr'],
        category: 'contract',
        priority: 'high',
        department: 'hr',
        customFields: {}
      }
    },
    {
      id: '3',
      title: 'NDA for Project X',
      documentName: 'NDA_ProjectX.pdf',
      documentUrl: '/documents/nda-project-x.pdf',
      recipients: [
        { 
          id: '4',
          name: 'Robert Johnson', 
          email: 'robert@example.com', 
          role: 'signer',
          order: 1,
          signed: true, 
          signedAt: '2025-05-14',
          isRequired: true,
          language: 'en'
        },
        { 
          id: '5',
          name: 'Michael Wilson', 
          email: 'michael@example.com', 
          role: 'signer',
          order: 2,
          signed: true, 
          signedAt: '2025-05-15',
          isRequired: true,
          language: 'en'
        },
      ],
      createdBy: 'Current User',
      createdAt: '2025-05-12',
      status: 'completed',
      settings: {
        allowDecline: false,
        requireAccessCode: true,
        enableReminders: true,
        allowDelegation: false,
        enableAuditTrail: true,
        retentionPeriod: 365,
        language: 'en',
        timezone: 'UTC'
      },
      fields: [],
      audit: [],
      reminders: {
        enabled: true,
        firstReminder: 3,
        recurringReminder: 7,
        finalReminder: 1
      },
      security: {
        requireIdVerification: true,
        enableGeolocation: true,
        requireBiometric: false,
        encryptionLevel: 'advanced',
        watermarkPages: true,
        preventPrinting: true,
        preventDownload: true,
        sessionTimeout: 15
      },
      metadata: {
        tags: ['nda', 'confidential'],
        category: 'legal',
        priority: 'high',
        department: 'legal',
        customFields: {}
      }
    },
    {
      id: '4',
      title: 'Vendor Agreement',
      documentName: 'VendorAgreement_TechSupplies.pdf',
      documentUrl: '/documents/vendor-agreement-tech.pdf',
      recipients: [
        { 
          id: '6',
          name: 'Emily Clark', 
          email: 'emily@example.com', 
          role: 'signer',
          order: 1,
          signed: false,
          isRequired: true,
          language: 'en'
        },
      ],
      createdBy: 'Current User',
      createdAt: '2025-05-05',
      status: 'declined',
      settings: {
        allowDecline: true,
        requireAccessCode: false,
        enableReminders: true,
        allowDelegation: true,
        enableAuditTrail: true,
        retentionPeriod: 365,
        language: 'en',
        timezone: 'UTC'
      },
      fields: [],
      audit: [],
      reminders: {
        enabled: true,
        firstReminder: 3,
        recurringReminder: 7,
        finalReminder: 1
      },
      security: {
        requireIdVerification: false,
        enableGeolocation: false,
        requireBiometric: false,
        encryptionLevel: 'standard',
        watermarkPages: false,
        preventPrinting: false,
        preventDownload: false,
        sessionTimeout: 30
      },
      metadata: {
        tags: ['vendor', 'procurement'],
        category: 'contract',
        priority: 'low',
        department: 'procurement',
        customFields: {}
      }
    },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleViewRequest = (request: SignatureRequest) => {
    toast({
      title: "View signature request",
      description: `Viewing details for ${request.title}.`,
    });
  };
  
  const handleRemindRecipients = (request: SignatureRequest) => {
    const pendingRecipients = request.recipients.filter(r => !r.signed).length;
    
    toast({
      title: "Reminder sent",
      description: `Reminder sent to ${pendingRecipients} pending recipient(s).`,
    });
  };
  
  const handleCancelRequest = (id: string) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id 
          ? { ...req, status: 'cancelled' as const } 
          : req
      )
    );
    
    toast({
      title: "Request canceled",
      description: "The signature request has been canceled.",
      variant: "destructive",
    });
  };

  return (
    <OdooMainLayout currentApp="Sign">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileSignature className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Electronic Signatures</h1>
                <p className="text-odoo-gray">
                  Send, track, and manage electronic signature requests for your documents.
                </p>
              </div>
            </div>
            <Button className="bg-odoo-primary hover:bg-odoo-primary/90" onClick={() => {
              toast({
                title: "Create Signature Request",
                description: "Opening signature request creation wizard.",
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Signature Request
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-semibold">{requests.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Awaiting Signature</p>
              <p className="text-2xl font-semibold">{requests.filter(r => r.status === 'sent').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-semibold">{requests.filter(r => r.status === 'draft').length}</p>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="sent">Awaiting Signature</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center justify-between my-4">
              <div className="w-64">
                <Input placeholder="Search requests..." onChange={(e) => {
                  // Search functionality would be implemented here
                }} />
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Filter Options",
                  description: "Advanced filtering options would open here.",
                });
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <TabsContent value="all">
              <div className="space-y-4">
                {requests.map(request => (
                  <SignatureRequestCard 
                    key={request.id} 
                    request={request} 
                    onView={handleViewRequest}
                    onRemind={request.status === 'sent' ? handleRemindRecipients : undefined}
                    onCancel={(request.status === 'draft' || request.status === 'sent') ? handleCancelRequest : undefined}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sent">
              <div className="space-y-4">
                {requests
                  .filter(request => request.status === 'sent')
                  .map(request => (
                    <SignatureRequestCard 
                      key={request.id} 
                      request={request} 
                      onView={handleViewRequest}
                      onRemind={handleRemindRecipients}
                      onCancel={handleCancelRequest}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="space-y-4">
                {requests
                  .filter(request => request.status === 'completed')
                  .map(request => (
                    <SignatureRequestCard 
                      key={request.id} 
                      request={request} 
                      onView={handleViewRequest}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="draft">
              <div className="space-y-4">
                {requests
                  .filter(request => request.status === 'draft')
                  .map(request => (
                    <SignatureRequestCard 
                      key={request.id} 
                      request={request} 
                      onView={handleViewRequest}
                      onCancel={handleCancelRequest}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </OdooMainLayout>
  );
};

export default Sign;
