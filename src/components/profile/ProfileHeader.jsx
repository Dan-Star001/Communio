import React from 'react';
import Button from '../../components/Button';
import { Settings, Share, CheckCircle } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { formatNumber } from '../../utils/utils';

const ProfileHeader = ({ user, onEditClick }) => {
  return (
    <div className="flex flex-col md:flex-row gap-14 items-start bg-background p-4 rounded-lg shadow-sm">
      {/* Profile Picture with Instagram-style elevation */}
      <div className="flex-shrink-0">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="h-100 w-100 md:h-40 md:w-40 rounded-full object-cover border-4 border-border "
            />
          ) : (
            <div className="h-100 w-100 md:h-40 md:w-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-border">
              <FaUser className="h-16 w-16 md:h-20 md:w-20 text-gray-500" />
            </div>
          )}
          {/* {user.verified && (
            <div className="absolute -bottom-0 -right-0 bg-primary rounded-full p-2">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          )} */}
        </div>
      </div>

      {/* Profile Info with Instagram-like spacing and hover effects */}
      <div className="flex-1 min-w-0">
        {/* Username and Actions with modern layout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-light text-text-primary">{user.displayName}</h1>
            {user.verified && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit profile
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats with Instagram-style clickable counters */}
        <div className="flex gap-8 mb-6">
          <div className="text-center hover:text-text-secondary cursor-pointer transition-colors">
            <div className="font-semibold text-lg">{formatNumber(user.posts)}</div>
            <div className="text-text-muted text-sm">posts</div>
          </div>
          <div className="text-center hover:text-text-secondary cursor-pointer transition-colors">
            <div className="font-semibold text-lg">{formatNumber(user.followers)}</div>
            <div className="text-text-muted text-sm">followers</div>
          </div>
          <div className="text-center hover:text-text-secondary cursor-pointer transition-colors">
            <div className="font-semibold text-lg">{formatNumber(user.following)}</div>
            <div className="text-text-muted text-sm">following</div>
          </div>
        </div>

        {/* Bio with subtle styling */}
        <div className="space-y-2">
          <p className="text-text-secondary text-sm">@{user.username}</p>
          <p className="text-text-secondary whitespace-pre-line text-sm">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;