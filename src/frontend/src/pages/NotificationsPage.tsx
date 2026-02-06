import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, saveUserData, NotificationItem } from '@/utils/portalStorage';

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Payment Successful',
    message: 'Your electricity bill payment of ₹2,450 was successful',
    category: 'transaction',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 'notif-2',
    title: 'New Offer Available',
    message: 'Get 10% cashback on UPI payments. Valid till 31 Dec 2026',
    category: 'offer',
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Account Statement Ready',
    message: 'Your monthly account statement for January 2026 is now available',
    category: 'account',
    timestamp: Date.now() - 86400000,
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows',
    category: 'security',
    timestamp: Date.now() - 172800000,
    read: true,
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Load notifications on mount
  useEffect(() => {
    if (user) {
      const saved = loadUserData(user.id, 'notifications');
      if (saved && saved.length > 0) {
        setNotifications(saved);
      }
    }
  }, [user]);

  // Save notifications whenever they change
  useEffect(() => {
    if (user) {
      saveUserData(user.id, 'notifications', notifications);
    }
  }, [notifications, user]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transaction': return 'bg-green-500/10 text-green-500';
      case 'offer': return 'bg-orange-500/10 text-orange-500';
      case 'account': return 'bg-blue-500/10 text-blue-500';
      case 'security': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <Badge variant="outline" className="mr-2">Demo Mode</Badge>
          Notifications are stored locally and persist across sessions.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-6" onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Your Notifications
              </CardTitle>
              <CardDescription>Stay updated with your account activity</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications to show</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.read ? 'bg-background' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {notification.read ? (
                            <CheckCheck className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Circle className="h-5 w-5 text-primary fill-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge variant="secondary" className={getCategoryColor(notification.category)}>
                              {notification.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
