import React, { useEffect, useState } from 'react';  // ✅ ADDED useState
import { useDispatch, useSelector } from 'react-redux';
import StoriesRow from '../components/feed/StoriesRow';
import PostCard from '../components/feed/PostCard';
import SuggestedUsers from '../components/feed/SuggestedUser';
import { fetchFeed, fetchStories, initializeSocket, updatePostLike, updatePostBookmark, updatePostComment } from '../store/postsSlice';
import { getSuggestedUsers } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Homepage = () => {
    const navigate = useNavigate();
    const [isAuthChecked, setIsAuthChecked] = useState(false);  // ✅ NEW STATE

    const dispatch = useDispatch();
    const { 
            feedPosts = [],     // ✅ DEFAULT EMPTY ARRAY
            stories = [],       // ✅ DEFAULT EMPTY ARRAY
            isLoading = false   // ✅ DEFAULT FALSE
        } = useSelector((state) => state.posts || {});

    const { suggested = [] } = useSelector((state) => state.user || {});  // ✅ SAFE USER SELECTOR

    useEffect(() => {
        dispatch(fetchFeed());  // FETCH FEED
        dispatch(fetchStories()); // FETCH STORIES
        dispatch(getSuggestedUsers()); // FETCH SUGGESTED USERS

        // Initialize socket for real-time updates
        const socket = initializeSocket('https://backend-e54z.onrender.com');
        socket.on('post_like_update', (data) => {
            dispatch(updatePostLike({ postId: data.postId, likes: data.likes }));
        });
        socket.on('post_bookmark_update', (data) => {
            dispatch(updatePostBookmark({ postId: data.postId, bookmarks: data.bookmarks }));
        });
        socket.on('post_comment_update', (data) => {
            dispatch(updatePostComment({ postId: data.postId, comment: data.comment }));
        });

        return () => {
            socket.off('post_like_update');
            socket.off('post_bookmark_update');
            socket.off('post_comment_update');
        };
    }, [dispatch]);

    
    useEffect(() => {
        // ✅ DELAY 800ms - LET TOKEN SAVE!
        const timer = setTimeout(() => {
            getHome();
            setIsAuthChecked(true);
        }, 800);  // ← 800ms DELAY FIXES RACE CONDITION!

        return () => clearTimeout(timer);
    }, []);

    let token = localStorage.getItem('token');  
    let url = "https://backend-e54z.onrender.com/api/users/homepage";
    
    const getHome = () => {        
        if (!token) {
            localStorage.removeItem('token');
            navigate("/signin");
            return;
        }

        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then((res) => {
            if (!res.data.status) {  // ✅ YOUR EXISTING LOGIC
                localStorage.removeItem('token');
                navigate("/signin");
            } 
        })
        .catch((err) => {
            console.error("❌ API ERROR:", err.response ? err.response.data : err);
            // ✅ DON'T REDIRECT ON NETWORK ERROR - JUST LOG
            localStorage.removeItem('token');
            navigate("/signin");
        });
    };


    // ✅ LOADING WHILE AUTH CHECK
    if (!isAuthChecked) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:gap-6">
                {/* Center Column - Stories + Posts (60% width on desktop, full on mobile) */}
                <div className="flex-1 max-w-lg mx-auto lg:mx-0 lg:max-w-xl">
                    {/* Stories */}
                    <div className="mb-6">
                        <StoriesRow stories={stories} />
                    </div>

                    {/* Posts */}
                    <div className="space-y-4">
                        {feedPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                        {feedPosts.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No posts yet. Create your first post!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Suggested Users (Fixed width, hidden on mobile) */}
                <div className="hidden lg:block lg:w-80 lg:shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
                    <div className="space-y-6">
                        <SuggestedUsers suggested={suggested} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;