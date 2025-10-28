import React from 'react';
import { Bell, PlusSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleCreateModal, setCurrentTab } from '../../store/uiSlice';
import { useNavigate } from 'react-router-dom';

const TopNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNotificationsClick = () => {
    dispatch(setCurrentTab('notifications'));
    navigate('/notifications');
  };

  const handleCreateClick = () => {
    dispatch(toggleCreateModal());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        {/* <h1 className="text-xl font-semibold">InstaClone</h1> */}
        {/* <img src="../src/assets/logo.png" alt="InstaClone" className="h-8 my-5" /> */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreateClick}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Create post"
          >
            <PlusSquare className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleNotificationsClick}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
