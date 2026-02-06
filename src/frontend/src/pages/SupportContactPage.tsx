import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HeadphonesIcon, Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, saveUserData, SupportTicket } from '@/utils/portalStorage';

const helpTopics = [
  { id: 'account', name: 'Account & Profile' },
  { id: 'transactions', name: 'Transactions & Payments' },
  { id: 'cards', name: 'Cards & ATM' },
  { id: 'loans', name: 'Loans & Deposits' },
  { id: 'technical', name: 'Technical Issues' },
  { id: 'other', name: 'Other' },
];

export default function SupportContactPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
  });

  // Load tickets on mount
  useEffect(() => {
    if (user) {
      const saved = loadUserData(user.id, 'supportTickets');
      if (saved) {
        setTickets(saved);
      }
    }
  }, [user]);

  // Save tickets whenever they change
  useEffect(() => {
    if (user && tickets.length > 0) {
      saveUserData(user.id, 'supportTickets', tickets);
    }
  }, [tickets, user]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.category || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      ...formData,
      status: 'open',
      createdAt: Date.now(),
    };

    setTickets([newTicket, ...tickets]);
    toast.success('Support ticket submitted successfully!');

    // Reset form
    setFormData({ subject: '', category: '', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'resolved': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Support & Contact</h1>
        <p className="text-muted-foreground">We're here to help you 24/7</p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          Support tickets are stored locally and persist across sessions.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="faq">Help Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit a Ticket
                </CardTitle>
                <CardDescription>Describe your issue and we'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {helpTopics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your issue"
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach us through multiple channels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Customer Care</p>
                      <p className="text-sm text-muted-foreground">1800-123-4567 (Toll Free)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@arthanidhi.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-sm text-muted-foreground">24/7 Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branch Locator</CardTitle>
                  <CardDescription>Find nearest branch or ATM</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Find Branches & ATMs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="h-5 w-5" />
                Your Support Tickets
              </CardTitle>
              <CardDescription>Track the status of your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No support tickets yet</p>
                  <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="contact"]')?.click()}>
                    Submit Your First Ticket
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">{ticket.id.slice(-8)}</TableCell>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell className="capitalize">{ticket.category}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <div className="grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find answers to common questions about {topic.name.toLowerCase()}
                  </p>
                  <Button variant="outline" className="w-full">View Articles</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
