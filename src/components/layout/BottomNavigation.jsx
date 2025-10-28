import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTab, toggleCreateModal } from '../../store/uiSlice';
import { Home, Search, PlusSquare, MessageCircle } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTab } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const navigationItems = [
    { id: 'home', icon: Home, action: () => { 
      dispatch(setCurrentTab('home')); 
      navigate('/home');
    }},
    { id: 'explore', icon: Search, action: () => { 
      dispatch(setCurrentTab('explore')); 
      navigate('/explore');
    }},
    { id: 'create', icon: PlusSquare, action: () => dispatch(toggleCreateModal()) },
    { id: 'messages', icon: MessageCircle, action: () => { 
      dispatch(setCurrentTab('messages')); 
      navigate('/messages');
    }},
    { id: 'profile', icon: FaUser, action: () => {
      dispatch(setCurrentTab('profile'));
      navigate('/profile');
    }},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.id === 'profile') {
            return (
              <button
                key={item.id}
                className="h-12 w-12 flex items-center justify-center"
                onClick={item.action}
              >
                <div className={`${isActive ? 'ring-2 ring-primary' : ''} rounded-full`}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.displayName || 'User'}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              className={`h-12 w-12 flex items-center justify-center ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
              onClick={item.action}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
