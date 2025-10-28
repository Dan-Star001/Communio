import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts } from '../store/postsSlice';
import { getUser, followUser, unfollowUser } from '../store/userSlice';
import ProfilePostCard from '../components/profile/ProfilePostCard';
import Button from '../components/Button';
import Sidebar from '../components/layout/Sidebar';
import { createConversation } from '../store/chatSlice';
import { FaUser } from 'react-icons/fa';

const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userPosts } = useSelector(state => state.posts);
    const { currentUser, isLoading } = useSelector(state => state.user);
    const currentUserData = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        dispatch(getUser(userId));
        dispatch(fetchUserPosts(userId));
    }, [dispatch, userId]);

    const handleFollow = () => {
        if (currentUser?.isFollowing) {
            dispatch(unfollowUser(userId));
        } else {
            dispatch(followUser(userId));
        }
    };

    const handleMessage = () => {
        dispatch(createConversation(userId))
            .unwrap()
            .then(() => navigate('/messages'))
            .catch(error => console.error('Failed to create conversation:', error));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex">
                <Sidebar />
                <div className="flex-1 ml-0 lg:ml-16 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading profile...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background flex">
                <Sidebar />
                <div className="flex-1 ml-0 lg:ml-16 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center py-8">
                            <p className="text-gray-500">User not found</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUserData && userId === currentUserData.id;

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 ml-0 lg:ml-16 p-4">
                {/* Profile Header */}
                <div className="max-w-4xl mx-auto">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
                    <div className="flex flex-row items-start gap-8">
                        {/* Profile Image */}
                        <div className="relative group flex-shrink-0">
                            {currentUser.avatar ? (
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.fullName}
                                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <FaUser className="h-10 w-10 text-gray-400" />
                                </div>
                            )}
                            {isOwnProfile && (
                                <Button
                                    onClick={() => navigate('/edit-profile')}
                                    className="absolute bottom-2 right-2 rounded-full bg-primary hover:bg-primary/90 p-1 w-7 h-7 flex items-center justify-center"
                                    title="Edit Profile"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </Button>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{currentUser.fullName}</h1>
                                <p className="text-lg font-semibold text-primary mb-1">@{currentUser.username}</p>
                                {currentUser.bio && (
                                    <p className="text-base text-gray-700 whitespace-pre-wrap mb-2">{currentUser.bio}</p>
                                )}
                                {currentUser.website && (
                                    <a 
                                        href={currentUser.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm block mb-2"
                                    >
                                        {currentUser.website}
                                    </a>
                                )}
                                <div className="flex gap-8 mt-2">
                                    <div className="text-center">
                                        <p className="font-bold">{currentUser.followers?.length || 0}</p>
                                        <p className="text-xs text-gray-500">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">{currentUser.following?.length || 0}</p>
                                        <p className="text-xs text-gray-500">Following</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">{userPosts[userId]?.length || 0}</p>
                                        <p className="text-xs text-gray-500">Posts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-2">
                                {isOwnProfile ? (
                                    <>
                                        <Button
                                            onClick={() => navigate('/edit-profile')}
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            onClick={handleMessage}
                                            variant="default"
                                            className="w-full sm:w-auto bg-blue-500 text-white"
                                        >
                                            Message
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleFollow}
                                            className={currentUser.isFollowing ? "bg-gray-200 text-gray-800" : "bg-primary"}
                                        >
                                            {currentUser.isFollowing ? 'Following' : 'Follow'}
                                        </Button>
                                        <Button
                                            onClick={handleMessage}
                                            variant="outline"
                                        >
                                            Message
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>                    {/* Posts Grid */}
                    <div className="mt-6">
                        {/* Post Tabs */}
                        <div className="flex justify-center border-b border-gray-200 mb-6">
                            <button className="px-6 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                                Posts
                            </button>
                            {/* Add more tabs here if needed (e.g., Tagged, Saved) */}
                        </div>

                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                            {userPosts[userId]?.length > 0 ? (
                                userPosts[userId].map(post => (
                                    <div key={post._id} className="aspect-square group relative cursor-pointer">
                                        <ProfilePostCard post={post} />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-6 text-white">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span className="font-semibold">{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <span className="font-semibold">{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xl font-medium text-gray-900 mb-2">No Posts Yet</p>
                                    {isOwnProfile ? (
                                        <>
                                            <p className="text-gray-500 text-center mb-4">Share photos and videos to start building your profile.</p>
                                            <Button 
                                                onClick={() => navigate('/create')}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                Share Your First Post
                                            </Button>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 text-center">When they share photos and videos, you'll see them here.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
