import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // LINE 1: Import Redux Toolkit
import axios from 'axios';                                       // LINE 2: Import Axios for API calls

// LINE 3: Async thunk to fetch conversations
export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            // LINE 4: Get token from localStorage
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1709/api/chat/conversations', {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000 // 10 seconds timeout
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch conversations' });
        }
    }
);

// LINE 5: Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ conversationId, page = 1 }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:1709/api/chat/conversations/${conversationId}/messages?page=${page}`,
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000 // 10 seconds timeout
                }
            );
            return { conversationId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch messages' });
        }
    }
);

// LINE 6: Async thunk to create conversation
export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (participantId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:1709/api/chat/conversations',
                { participantId },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000 // 10 seconds timeout
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create conversation' });
        }
    }
);

// LINE 7: Initial state
const initialState = {
    conversations: [],
    messages: {},
    unreadCounts: {},
    isLoading: false,
    error: null,
    currentConversation: null
};

// LINE 8: Create slice
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // LINE 9: Add new message to state
        addMessage: (state, action) => {
            const { conversationId, ...message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].unshift(message);
            
            // LINE 10: Update conversation last message
            const convIndex = state.conversations.findIndex(c => c._id === conversationId);
            if (convIndex !== -1) {
                state.conversations[convIndex].lastMessage = message;
                state.conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            }
        },
        // LINE 11: Set current conversation
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        // LINE 12: Update unread count
        updateUnreadCount: (state, action) => {
            const { conversationId, count } = action.payload;
            state.unreadCounts[conversationId] = count;
        },
        // LINE 13: Clear error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // LINE 14: Handle fetch conversations
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversations = action.payload.conversations;
                state.unreadCounts = action.payload.unreadCounts;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })
            // LINE 15: Handle fetch messages
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { conversationId, messages } = action.payload;
                if (!state.messages[conversationId]) {
                    state.messages[conversationId] = [];
                }
                state.messages[conversationId] = [...state.messages[conversationId], ...messages];
            });
    }
});

export const { addMessage, setCurrentConversation, updateUnreadCount, clearError } = chatSlice.actions;
export default chatSlice.reducer;