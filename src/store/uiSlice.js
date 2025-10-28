import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'ui/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://backend-e54z.onrender.com/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

// Async thunk to mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'ui/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://backend-e54z.onrender.com/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// Async thunk to mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'ui/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://backend-e54z.onrender.com/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

const initialState = {
  currentTab: 'home',
  isCreateModalOpen: false,
  isSidebarCollapsed: false,
  searchQuery: '',
  notifications: [],
  theme: 'light',
  // socket: null, // Removed from Redux state
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    toggleCreateModal: (state) => {
      state.isCreateModalOpen = !state.isCreateModalOpen;
    },
    setCreateModalOpen: (state, action) => {
      state.isCreateModalOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    markNotificationAsReadSync: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setCollapsed: (state, action) => { state.isCollapsed = action.payload; },
    // setSocket: removed, use React context or ref for socket
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload._id);
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
      });
  },
});

export const {
  setCurrentTab,
  toggleCreateModal,
  setCreateModalOpen,
  toggleSidebar,
  setSearchQuery,
  markNotificationAsReadSync,
  addNotification,
  setTheme,
  setCollapsed
} = uiSlice.actions;
export default uiSlice.reducer;