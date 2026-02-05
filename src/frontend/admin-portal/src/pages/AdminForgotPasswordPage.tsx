import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info, Mail } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would trigger a password reset email
    setSubmitted(true);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-display">Reset Admin Password</CardTitle>
          <CardDescription>
            Enter your admin email to receive password reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a demo system. In production, a secure password reset link would be sent to your email.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@arthanidhi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Send Reset Instructions
              </Button>

              <Button
                type="button"
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  If an admin account exists with the email <strong>{email}</strong>, you will receive password reset instructions shortly.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Please check your email inbox and spam folder.</p>
                <p>The reset link will expire in 1 hour for security reasons.</p>
              </div>

              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
