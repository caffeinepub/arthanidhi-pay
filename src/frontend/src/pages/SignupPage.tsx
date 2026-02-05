import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useQueryClient } from '@tanstack/react-query';
import type { Account } from '../backend';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const saveProfile = useSaveCallerUserProfile();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // KYC fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [idDocumentNumber, setIdDocumentNumber] = useState('');
  const [address, setAddress] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate KYC fields
    if (!dateOfBirth.trim()) {
      setError('Please enter your date of birth');
      return;
    }

    if (!idDocumentNumber.trim()) {
      setError('Please enter your ID document number');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your address');
      return;
    }

    setIsLoading(true);

    try {
      // First, create the user account in localStorage
      await signup(email, password, displayName.trim());
      
      // Small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Save KYC profile data with all required Account fields
      // Backend will generate customerId, accountNumber, and set initial balance
      const newAccount: Account = {
        name: displayName.trim(),
        dateOfBirth: dateOfBirth.trim(),
        idDocumentNumber: idDocumentNumber.trim(),
        address: address.trim(),
        customerId: '', // Backend will generate
        accountNumber: '', // Backend will generate
        balance: BigInt(0), // Backend will set to INITIAL_BALANCE
        transactionHistory: [],
      };
      
      await saveProfile.mutateAsync(newAccount);
      
      // Force invalidate all queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['callerAccount'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      
      // Navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-display">Create Account</CardTitle>
          <CardDescription>
            Sign up for ArthaNidhi to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name *</Label>
              <Input
                id="displayName"
                placeholder="Enter your full name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">KYC Information</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide the following details to complete your registration
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  disabled={isLoading}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idDocumentNumber">ID Document Number *</Label>
                <Input
                  id="idDocumentNumber"
                  placeholder="Enter your Aadhaar/PAN/Passport number"
                  value={idDocumentNumber}
                  onChange={(e) => setIdDocumentNumber(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>

            <div className="pt-4 border-t text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
