import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, saveUserData, Beneficiary } from '@/utils/portalStorage';

export default function BeneficiariesPage() {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  // Load beneficiaries on mount
  useEffect(() => {
    if (user) {
      const saved = loadUserData(user.id, 'beneficiaries');
      if (saved) {
        setBeneficiaries(saved);
      }
    }
  }, [user]);

  // Save beneficiaries whenever they change
  useEffect(() => {
    if (user && beneficiaries.length > 0) {
      saveUserData(user.id, 'beneficiaries', beneficiaries);
    }
  }, [beneficiaries, user]);

  const handleAddBeneficiary = () => {
    if (!formData.name || !formData.accountNumber || !formData.ifscCode || !formData.bankName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic validation
    if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      toast.error('Account number must be between 9 and 18 digits');
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      toast.error('Invalid IFSC code format');
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: `ben_${Date.now()}`,
      ...formData,
      ifscCode: formData.ifscCode.toUpperCase(),
      addedAt: Date.now(),
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    toast.success('Beneficiary added successfully!');
    
    // Reset form
    setFormData({ name: '', accountNumber: '', ifscCode: '', bankName: '' });
    setIsDialogOpen(false);
  };

  const handleRemoveBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    toast.success('Beneficiary removed');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Beneficiaries</h1>
          <p className="text-muted-foreground">Manage your saved recipients for quick transfers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Beneficiary
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Beneficiary</DialogTitle>
              <DialogDescription>
                Enter the beneficiary details to save them for future transfers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Beneficiary Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="1234567890"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="SBIN0001234"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="State Bank of India"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBeneficiary}>Add Beneficiary</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          Beneficiaries are stored locally in your browser and will persist across sessions.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Saved Beneficiaries
          </CardTitle>
          <CardDescription>
            {beneficiaries.length} beneficiar{beneficiaries.length === 1 ? 'y' : 'ies'} saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          {beneficiaries.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No beneficiaries added yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Beneficiary
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>IFSC Code</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaries.map((beneficiary) => (
                  <TableRow key={beneficiary.id}>
                    <TableCell className="font-medium">{beneficiary.name}</TableCell>
                    <TableCell>{beneficiary.accountNumber}</TableCell>
                    <TableCell>{beneficiary.ifscCode}</TableCell>
                    <TableCell>{beneficiary.bankName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
