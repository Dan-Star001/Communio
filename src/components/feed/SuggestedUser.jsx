import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSuggestedUsers, followUser, unfollowUser } from '../../store/userSlice';
import Button from '../Button';
import { FaUser } from 'react-icons/fa';

const SuggestedUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { suggested = [], isLoading } = useSelector(state => state.user || {});

    useEffect(() => {
        dispatch(getSuggestedUsers());
    }, [dispatch]);

    const handleFollow = (e, userId) => {
        e.stopPropagation(); // Prevent navigation when clicking follow button
        dispatch(followUser(userId));
    };

    const handleUnfollow = (e, userId) => {
        e.stopPropagation(); // Prevent navigation when clicking unfollow button
        dispatch(unfollowUser(userId));
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">Suggested for you</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">Loading suggestions...</p>
                    </div>
                ) : suggested.length > 0 ? (
                    suggested.map(user => (
                        <div
                            key={user._id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => handleUserClick(user._id)}
                        >
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName}
                                    className="h-10 w-10 rounded-full"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FaUser className="h-5 w-5 text-gray-500" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{user.fullName}</p>
                                <p className="text-sm text-gray-500 truncate">@{user.userName}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={(e) => user.isFollowing ? handleUnfollow(e, user._id) : handleFollow(e, user._id)}
                            >
                                {user.isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No suggestions yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestedUsers;
