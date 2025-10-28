import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getSuggestedUsers = createAsyncThunk(
    'user/getSuggestedUsers',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axios.get('http://localhost:1709/api/users/suggested', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // LINE 1: FIX - ALWAYS RETURN ARRAY
            return response.data.suggested || [];
        } catch (error) {
            console.error('💥 [USER SLICE] Suggested users error:', error);
            // LINE 2: FIX - ALWAYS RETURN EMPTY ARRAY ON ERROR
            return rejectWithValue(error.response?.data || 'Failed to fetch suggested users');
        }
    }
);

export const searchUsers = createAsyncThunk(
    'user/searchUsers',
    async (query, { rejectWithValue }) => {
        try {
            if (!query || query.trim() === '') {
                return [];
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axios.get(`http://localhost:1709/api/users/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // LINE 3: FIX - ALWAYS RETURN ARRAY
            return response.data.users || [];
        } catch (error) {
            console.error('💥 [USER SLICE] Search users error:', error);
            return rejectWithValue(error.response?.data || 'Failed to search users');
        }
    }
);

export const followUser = createAsyncThunk(
    'user/followUser',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:1709/api/users/${userId}/follow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { userId, ...response.data };
        } catch (error) {
            console.error('💥 [USER SLICE] Follow user error:', error);
            return rejectWithValue(error.response?.data || 'Failed to follow user');
        }
    }
);

export const unfollowUser = createAsyncThunk(
    'user/unfollowUser',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:1709/api/users/${userId}/unfollow`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { userId, ...response.data };
        } catch (error) {
            console.error('💥 [USER SLICE] Unfollow user error:', error);
            return rejectWithValue(error.response?.data || 'Failed to unfollow user');
        }
    }
);

export const getUser = createAsyncThunk(
    'user/getUser',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1709/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.user;
        } catch (error) {
            console.error('💥 [USER SLICE] Get user error:', error);
            return rejectWithValue(error.response?.data || 'Failed to get user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        suggested: [],          // ✅ EMPTY ARRAY
        searchResults: [],      // ✅ EMPTY ARRAY
        currentUser: null,      // For profile page
        isLoading: false,
        error: null
    },
    reducers: {
        // LINE 4: OPTIONAL - CLEAR ERROR
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // GET SUGGESTED USERS
            .addCase(getSuggestedUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSuggestedUsers.fulfilled, (state, action) => {
                state.suggested = action.payload || [];  // ✅ ALWAYS ARRAY
                state.isLoading = false;
            })
            .addCase(getSuggestedUsers.rejected, (state, action) => {
                state.suggested = [];  // ✅ RESET TO EMPTY ARRAY
                state.isLoading = false;
                state.error = action.payload;
            })
            // SEARCH USERS
            .addCase(searchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchResults = action.payload || [];  // ✅ ALWAYS ARRAY
                state.isLoading = false;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.searchResults = [];  // ✅ RESET TO EMPTY ARRAY
                state.isLoading = false;
                state.error = action.payload;
            })
            // FOLLOW USER
            .addCase(followUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update suggested users list if the followed user is in it
                state.suggested = state.suggested.map(user =>
                    user._id === action.payload.userId
                        ? { ...user, isFollowing: true }
                        : user
                );
                // Update current user if it's the profile page
                if (state.currentUser && state.currentUser._id === action.payload.userId) {
                    state.currentUser.isFollowing = true;
                    state.currentUser.followers.push({ _id: 'currentUser' }); // Simplified
                }
            })
            .addCase(followUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // UNFOLLOW USER
            .addCase(unfollowUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update suggested users list
                state.suggested = state.suggested.map(user =>
                    user._id === action.payload.userId
                        ? { ...user, isFollowing: false }
                        : user
                );
                // Update current user if it's the profile page
                if (state.currentUser && state.currentUser._id === action.payload.userId) {
                    state.currentUser.isFollowing = false;
                    state.currentUser.followers = state.currentUser.followers.filter(f => f._id !== 'currentUser');
                }
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // GET USER
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.isLoading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.currentUser = null;
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;