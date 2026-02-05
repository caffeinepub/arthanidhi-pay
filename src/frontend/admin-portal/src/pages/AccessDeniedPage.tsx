import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-display">Access Denied</CardTitle>
          </div>
          <CardDescription>
            You do not have permission to access this area
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
