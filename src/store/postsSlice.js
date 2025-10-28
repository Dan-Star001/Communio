import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

const initialState = {
    feedPosts: [],
    userPosts: {},
    isLoading: false,
    stories: [],
    error: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        updatePostLike: (state, action) => {
            const { postId, likes } = action.payload;
            const post = state.feedPosts.find(p => p._id === postId);
            if (post) {
                post.likes = likes;
            }
        },
        updatePostBookmark: (state, action) => {
            const { postId, bookmarks } = action.payload;
            const post = state.feedPosts.find(p => p._id === postId);
            if (post) {
                post.bookmarks = bookmarks;
            }
        },
        updatePostComment: (state, action) => {
            const { postId, comment } = action.payload;
            const post = state.feedPosts.find(p => p._id === postId);
            if (post) {
                post.comments.push(comment);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.feedPosts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.userPosts[action.meta.arg] = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.feedPosts.unshift(action.payload);
                state.isLoading = false;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const post = state.feedPosts.find(p => p._id === action.meta.arg);
                if (post) {
                    post.likes = action.payload.likes;
                }
            })
            .addCase(toggleBookmark.fulfilled, (state, action) => {
                const post = state.feedPosts.find(p => p._id === action.meta.arg);
                if (post) {
                    post.bookmarks = action.payload.bookmarks;
                }
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const post = state.feedPosts.find(p => p._id === action.meta.arg.postId);
                if (post) {
                    post.comments.push(action.payload.comment);
                }
            })
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.stories = action.payload;
                state.isLoading = false;
            });
    }
});

export const fetchFeed = createAsyncThunk(
    'posts/fetchFeed',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1709/api/posts/feed', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.posts;
        } catch (error) {
            console.error('Fetch feed error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1709/api/posts/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.posts;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            
            // ✅ FIXED: Use full URL and proper headers
            const response = await axios.post('http://localhost:1709/api/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type - let browser set it with boundary
                }
            });
            
            return response.data.post;
        } catch (error) {
            console.error('❌ Create post error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to create post');
        }
    }
);

export const toggleLike = createAsyncThunk(
    'posts/toggleLike',
    async (postId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:1709/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { postId, likes: response.data.likes };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const toggleBookmark = createAsyncThunk(
    'posts/toggleBookmark',
    async (postId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:1709/api/posts/${postId}/bookmark`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { postId, isBookmarked: response.data.isBookmarked };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'posts/addComment',
    async ({ postId, text }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:1709/api/posts/${postId}/comment`, { text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { postId, comment: response.data.comment };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchStories = createAsyncThunk(
    'posts/fetchStories',
    async (_, { rejectWithValue }) => {
        try {
            // SIMULATED STORIES DATA (REPLACE WITH REAL API LATER)
            return [
                { id: 1, user: { fullName: 'John Doe', avatar: '/default-avatar.png' } },
                { id: 2, user: { fullName: 'Sarah Wilson', avatar: '/default-avatar.png' } },
                { id: 3, user: { fullName: 'Mike Chen', avatar: '/default-avatar.png' } }
            ];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch stories');
        }
    }
);

// Socket.io setup for real-time updates
let socket = null;

export const initializeSocket = (url = 'http://localhost:1709') => {
    if (!socket) {
        socket = io(url, {
            auth: {
                token: localStorage.getItem('token')
            }
        }).connect();

        socket.on('post_like_update', (data) => {
            // Dispatch action to update state
            // This will be handled in the component that uses the store
        });

        socket.on('post_bookmark_update', (data) => {
            // Dispatch action to update state
        });

        socket.on('post_comment_update', (data) => {
            // Dispatch action to update state
        });
    }
    return socket;
};

export const joinPostRoom = (postId) => {
    if (socket) {
        socket.emit('join_post', postId);
    }
};

export const leavePostRoom = (postId) => {
    if (socket) {
        socket.emit('leave_post', postId);
    }
};

export const { updatePostLike, updatePostBookmark, updatePostComment } = postsSlice.actions;

export default postsSlice.reducer;
