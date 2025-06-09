
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, MessageCircle, Trophy, X } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'prayer' | 'comment' | 'challenge' | 'milestone';
  title: string;
  message: string;
  createdAt: number;
  isRead: boolean;
  actionUrl?: string;
}

const CommunityNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'prayer',
      title: 'Prayer Support',
      message: '5 people joined in prayer for your request',
      createdAt: Date.now() - 3600000,
      isRead: false
    },
    {
      id: '2',
      type: 'challenge',
      title: 'Challenge Milestone',
      message: 'You completed day 7 of the 30 Days of Gratitude challenge!',
      createdAt: Date.now() - 7200000,
      isRead: false
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      message: 'Someone shared encouragement on your testimony',
      createdAt: Date.now() - 10800000,
      isRead: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'prayer': return <Heart size={16} className="text-red-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />;
      case 'challenge': return <Trophy size={16} className="text-yellow-500" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityNotifications;
