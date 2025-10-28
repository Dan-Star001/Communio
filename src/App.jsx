import React, { useEffect, useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTab } from './store/uiSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout';
import Homepage from './pages/Homepage'; 
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CreatePostModal from './components/modals/CreatePostModal';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import EditProfile from './pages/EditProfile'; // Updated import
import SplashPage from './pages/SplashPage';
import ExplorePage from './pages/ExplorePage';

// Custom component to sync URL with Redux state
const AppContent = () => {
  const dispatch = useDispatch();
  const { currentTab } = useSelector((state) => state.ui);
  const location = useLocation();

  // Sync Redux currentTab with the current route
  useEffect(() => {
    const pathToTab = {
      '/': 'home',
      '/home': 'home',
      '/explore': 'explore',
      '/profile': 'profile',
      '/messages': 'messages',
      '/notifications': 'notifications',
      '/reels': 'reels',
    };

    // Check if it's a profile route with userId
    const isProfileRoute = location.pathname.startsWith('/profile/');
    const tab = isProfileRoute ? 'profile' : (pathToTab[location.pathname] || 'home');

    if (currentTab !== tab) {
      dispatch(setCurrentTab(tab));
    }
  }, [location.pathname, currentTab, dispatch]);


  let token = localStorage.token


  return (
    <Layout>
      <Routes>
        <Route path="/home" element={token?<Homepage/>:<Navigate to="/signin"/>}  />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route
          path="/reels"
          element={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Reels Coming Soon</h2>
                <p className="text-text-muted">Short-form video content will be available here.</p>
              </div>
            </div>
          }
        />
      </Routes>
      <CreatePostModal /> {/* Globally accessible modal */}
    </Layout>
  );
};

function App() {
  const { theme } = useSelector((state) => state.ui);
  const [openModal, setOpenModal] = useState(true);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <SocketProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signup />} />
        <Route path="/edit-profile" element={<EditProfile />} /> {/* Updated route */}
        <Route path="/*" element={<AppContent />} /> {/* Catch-all for tab routes */}
        <Route path="/splash" element={<SplashPage />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;