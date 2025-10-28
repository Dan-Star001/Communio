import React, { useState } from 'react';
import { Grid, Bookmark, UserCheck, Heart, MessageCircle } from 'lucide-react';
import Button from '../../components/Button';

const ProfileTabs = ({ posts }) => {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', icon: Grid, label: 'Posts', count: posts.length },
    { id: 'saved', icon: Bookmark, label: 'Saved', count: 0 },
    { id: 'tagged', icon: UserCheck, label: 'Tagged', count: 0 },
  ];

  return (
    <div>
      {/* Tab Navigation with Instagram-style underline */}
      <div className="flex justify-center border-b border-border mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-text-primary font-medium'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm uppercase tracking-wide">
                {tab.label} <span className="text-text-muted">({tab.count})</span>
              </span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content with Instagram-style grid */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          <div>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-surface rounded-lg overflow-hidden cursor-pointer group relative hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <Heart className="h-6 w-6 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <MessageCircle className="h-6 w-6 fill-white" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
                  <Grid className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-text-primary">No posts yet</h3>
                <p className="text-text-muted">When you share posts, they'll appear on your profile.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-text-primary">No saved posts yet</h3>
            <p className="text-text-muted">Save posts you want to see again.</p>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-text-primary">No tagged posts yet</h3>
            <p className="text-text-muted">When people tag you in posts, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;