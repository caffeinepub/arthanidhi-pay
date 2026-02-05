import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useUpdateProfile } from '../hooks/useQueries';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Save, User, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const { theme, toggleTheme } = useSettings();

  const [displayName, setDisplayName] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  // Initialize form when profile loads
  useEffect(() => {
    if (userProfile && !hasEdited) {
      // Backend profile uses 'name' field
      setDisplayName(userProfile.name || '');
    } else if (user && !hasEdited && !userProfile) {
      // Fallback to auth context displayName if no backend profile yet
      setDisplayName(user.displayName || '');
    }
  }, [userProfile, user, hasEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(displayName.trim());
      toast.success('Profile updated successfully');
      setHasEdited(false);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleNameChange = (value: string) => {
    setDisplayName(value);
    setHasEdited(true);
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              {user?.email && (
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed after registration
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={updateProfileMutation.isPending || !hasEdited}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how ArthaNidhi Pay looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
