import React from 'react';
import { FaUser } from 'react-icons/fa';

const ProfilePostCard = ({ post }) => {
    return (
        <div className="relative group cursor-pointer">
            {/* Media Container */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {post.mediaUrl ? (
                    post.mediaType === 'video' ? (
                        <video
                            src={post.mediaUrl}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            muted
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => e.target.pause()}
                        />
                    ) : (
                        <img
                            src={post.mediaUrl}
                            alt="Post"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    )
                ) : (
                    // Text-only post fallback
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4">
                        <p className="text-gray-600 text-sm text-center line-clamp-3">
                            {post.text || 'No content'}
                        </p>
                    </div>
                )}
            </div>

            {/* Overlay with caption on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end p-3">
                <div className="text-white">
                    {post.text && (
                        <p className="text-sm line-clamp-2">{post.text}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                            ❤️ {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            💬 {post.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Media type indicator */}
            {post.mediaType === 'video' && (
                <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12l-6-4h12l-6 4z"/>
                    </svg>
                </div>
            )}
        </div>
    );
};

export default ProfilePostCard;
