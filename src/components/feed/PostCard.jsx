import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLike, toggleBookmark } from '../../store/postsSlice'; // ✅ FIXED IMPORT
import Button from '../../components/Button';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatNumber } from '../../utils/utils';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '2 hours ago';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays/7)}w ago`;
  return date.toLocaleDateString();
};

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = () => dispatch(toggleLike(post._id));
  const handleSave = () => dispatch(toggleBookmark(post._id));
  const handleFollowToggle = () => setIsFollowing(!isFollowing);

  // ✅ CHECK IF POST HAS MEDIA
  const hasMedia = post.mediaUrl && post.mediaType;
  const userId = localStorage.getItem('userId');
  const isLiked = post.likes?.includes(userId);
  const isSaved = post.bookmarks?.includes(userId);

  return (
    <article className="bg-card rounded-lg border border-border overflow-hidden w-full max-w-md mx-auto sm:max-w-none">
      {/* POST HEADER */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <img
            src={post.userId?.avatar || '/default-avatar.png'}
            alt={post.userId?.fullName || post.userId?.userName || 'User'}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs sm:text-sm truncate">
              {post.userId?.userName || 'Unknown User'}
            </p>
            {post.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{post.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          variant={isFollowing ? "outline" : "default"} 
          size="sm"
          onClick={handleFollowToggle}
          className="h-7 px-2 sm:h-8 sm:px-3 text-xs flex-shrink-0 ml-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      </div>

      {/* ✅ MEDIA RENDERING - CLOUDINARY SUPPORT */}
      {hasMedia && (
        <div className="relative group">
          <div className="w-full aspect-square bg-surface overflow-hidden">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt="Post content"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-image.png';
                }}
              />
            ) : (
              <video 
                src={post.mediaUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                onError={(e) => {
                }}
              >
                Your browser doesn't support video.
              </video>
            )}
          </div>
        </div>
      )}

      {/* ✅ TEXT-ONLY POST (No media) */}
      {!hasMedia && post.text?.trim() && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20">
          <p className="text-sm leading-relaxed">{post.text}</p>
        </div>
      )}

      {/* POST ACTIONS */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 ${
                isLiked ? 'text-red-500' : 'text-foreground'
              }`}
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200"
              aria-label="Comment"
            >
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200"
              aria-label="Share"
            >
              <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className={`p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 ${
              isSaved ? 'text-foreground' : 'text-foreground'
            }`}
            aria-label={isSaved ? 'Unsave post' : 'Save post'}
          >
            <Bookmark className={`h-5 w-5 sm:h-6 sm:w-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* LIKES COUNT */}
        <p className="font-semibold text-xs sm:text-sm mb-2">
          {formatNumber(post.likes?.length || 0)} {post.likes?.length === 1 ? 'like' : 'likes'}
        </p>

        {/* CAPTION */}
        {post.text?.trim() && hasMedia && (
          <div className="text-xs sm:text-sm mb-2 leading-relaxed">
            <span className="font-semibold mr-1 sm:mr-2">
              {post.userId?.userName || 'Unknown User'}
            </span>
            <span className="break-words">{post.text}</span>
          </div>
        )}

        {/* COMMENTS */}
        {post.comments?.length > 0 && (
          <button className="text-xs sm:text-sm text-muted-foreground mb-2 hover:text-foreground transition-colors block w-full text-left">
            View all {formatNumber(post.comments.length)} {post.comments.length === 1 ? 'comment' : 'comments'}
          </button>
        )}

        {/* TIMESTAMP */}
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(post.createdAt)}
        </p>
      </div>
    </article>
  );
};

export default PostCard;