import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import postsReducer  from './store/postsSlice.js'
import uiReducer from './store/uiSlice.js'
import authReducer from './store/authSlice.js'
import chatReducer from './store/chatSlice.js'
import userReducer from './store/userSlice';
import axios from 'axios';

let store = configureStore({
  reducer: { posts: postsReducer, ui: uiReducer, auth: authReducer, chat: chatReducer, user: userReducer }
})

// Configure axios defaults early so all calls pick up baseURL and Authorization
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:1709';
axios.defaults.baseURL = API_BASE;
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Simple response interceptor to log server-side failures (helps debug 500s)
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[axios] response error', err.response ? err.response.data : err.message);
    return Promise.reject(err);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
          <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
