import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, setCurrentTab } from '../store/uiSlice';
import Button from '../components/Button';
import { Heart, UserPlus, MessageCircle, AtSign } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../context/SocketContext';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, error } = useSelector((state) => state.ui);
  const socket = useSocket();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    dispatch(fetchNotifications());
    if (socket) {
      socket.emit('join_notifications');
      socket.on('new_notification', () => {
        dispatch(fetchNotifications());
      });
      return () => {
        socket.off('new_notification');
      };
    }
  }, [dispatch, socket]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-primary" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'mention':
        return <AtSign className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notificationId, userId) => {
    dispatch(markNotificationAsRead(notificationId));
    dispatch(setCurrentTab('profile'));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sets the minimum height to the full screen and applies a background color (custom class bg-background) */}
      <div className="max-w-3xl mx-auto">
        {/* Increases the maximum width to 48rem (768px) and centers the content with margin auto */}
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
          {/* Fixes the header at the top of the viewport, applies a semi-transparent background (95% opacity),
             adds a blur effect, a bottom border (custom border-border), padding of 1rem, and a high z-index for layering */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Notifications</h1>
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
          {/* Sets the heading text size to extra-large (1.25rem) and makes it bold */}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchNotifications())}>
              Try Again
            </Button>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !error && (
          <div className="divide-y divide-border">
            {/* Adds horizontal dividers between items using the custom border-border color */}
            {notifications.length === 0 ? (
            <div className="p-8 text-center">
              {/* Applies padding of 2rem and centers the text */}
              <Heart className="h-12 w-12 text-text-muted mx-auto mb-4" />
              {/* Sets the icon height and width to 3rem, uses a custom muted text color, centers it horizontally, and adds a 1rem bottom margin */}
              <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
              {/* Sets the text size to large (1.125rem), medium font weight, and a 0.5rem bottom margin */}
              <p className="text-text-muted">When someone likes, comments, or follows you, you'll see it here.</p>
              {/* Uses a custom muted text color for the paragraph */}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(notification._id, notification.sender._id)}
              >
                {/* Applies 1rem padding, changes background on hover to a custom accent color, adds a pointer cursor,
                   enables smooth color transitions, and adds a light primary background (5% opacity) for unread notifications */}
                <div className="flex items-start gap-3">
                  {/* Uses flexbox to align items at the start with a 0.75rem gap */}
                  <div className="relative">
                    {/* Creates a relative container for positioning */}
                    {notification.sender.avatar ? (
                      <img
                        src={notification.sender.avatar}
                        alt={notification.sender.userName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    {/* Sets the image height and width to 2.5rem, rounds the corners fully, and ensures the image covers the area */}
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                      {/* Positions an absolute child with a -0.25rem offset from bottom and right, uses a custom background color,
                         rounds the corners fully, and adds 0.25rem padding */}
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Allows the div to grow and sets a minimum width of 0 to handle overflow */}
                    <div className="flex items-center gap-2 mb-1">
                      {/* Uses flexbox to center items with a 0.5rem gap and a 0.25rem bottom margin */}
                      <span className="font-medium text-sm">{notification.sender.userName}</span>
                      {/* Applies medium font weight and small text size (0.875rem) */}
                      <span className="text-sm text-text-secondary">{notification.message}</span>
                      {/* Sets small text size and a custom secondary text color */}
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                        // Displays a 0.5rem x 0.5rem dot with a custom primary color and full rounding when unread
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                    {/* Sets extra-small text size (0.75rem) and a custom muted text color for the timestamp */}
                  </div>
                  {notification.type === 'follow' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Follow Back
                    </Button>
                    // Renders an outline button with small size, 2rem height, 0.75rem padding on x-axis, extra-small text,
                    // and prevents click propagation for the follow action
                  )}
                </div>
              </div>
            ))
          )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 text-center">
          {/* Applies 1rem padding and centers the text */}
          <p className="text-xs text-text-muted">
            You're all caught up! Check back later for new notifications.
          </p>
          {/* Sets extra-small text size and a custom muted text color */}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;