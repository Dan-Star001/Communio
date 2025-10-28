import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTab, toggleCreateModal, setTheme } from '../../store/uiSlice';
import { 
  MdHome, MdSearch, MdAdd, MdPlayArrow, MdPerson, MdChat, MdFavorite, MdSettings
} from 'react-icons/md';
import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import Switch from '../../components/Switch';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTab, theme } = useSelector((state) => state.ui);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const settingsRef = useRef(null);

  const isCollapsed = useSelector((state) => state.ui.isCollapsed ?? false);
  const setIsCollapsed = (value) => dispatch({ type: 'ui/setCollapsed', payload: value });


  // 🆕 Keep all your existing functions (unchanged)
const navigationItems = [
  { id: 'home', icon: MdHome, label: 'Home', action: () => { 
    dispatch(setCurrentTab('home'));
    navigate('/home');
    setIsCollapsed(false);
  } },
  { id: 'explore', icon: MdSearch, label: 'Search', action: () => { 
    dispatch(setCurrentTab('explore'));
    navigate('/explore');
    setIsCollapsed(false);
  } },
  { id: 'create', icon: MdAdd, label: 'Create', action: () => { 
    handleCreateClick();
    setIsCollapsed(false);
  } },
  { id: 'reels', icon: MdPlayArrow, label: 'Reels', action: () => { 
    dispatch(setCurrentTab('reels'));
    navigate('/reels');
    setIsCollapsed(false);
  } },
  { id: 'messages', icon: MdChat, label: 'Messages', action: () => { 
    dispatch(setCurrentTab('messages'));
    navigate('/messages');
    setIsCollapsed(true);
  } },
  { id: 'notifications', icon: MdFavorite, label: 'Notifications', action: () => { 
    dispatch(setCurrentTab('notifications'));
    navigate('/notifications');
    setIsCollapsed(false);
  } },
  { id: 'profile', icon: MdPerson, label: 'Profile', action: () => {
    const currentUserData = JSON.parse(localStorage.getItem('user'));
    if (currentUserData?.id) {
      dispatch(setCurrentTab('profile'));
      navigate(`/profile/${currentUserData.id}`);
      setIsCollapsed(false);
    }
  } },
];

const handleThemeToggle = (checked) => {
  setIsDarkMode(checked);
  dispatch(setTheme(checked ? 'dark' : 'light'));
};

const handleCreateClick = () => {
  dispatch(toggleCreateModal());
};

const handleLogout = () => {
  dispatch(logout());
  navigate('/signin');
};

useEffect(() => {
  setIsDarkMode(theme === 'dark');
}, [theme]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsSettingsOpen(false);
      setIsAppearanceOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  // 🆕 FIX 1: HIDE SIDEBAR ON MOBILE (lg:hidden → hidden lg:flex)
  return (
    <aside 
      className={`hidden lg:flex fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } border-r border-border bg-surface flex-col`}
    >
      <div className="flex h-full flex-col">
        {/* 🆕 FIX 1: Logo only shows when expanded */}
        <div className="flex h-16 items-center justify-start px-4 border-b border-border">
          {!isCollapsed && (
            <img src="/src/assets/logo.png" className='m-4' width={160} alt="" />
          )}
        </div>

        {/* 🆕 FIX 2: EQUAL X-AXIS SPACING FOR ICONS */}
        <nav className="flex-1 py-4 px-4"> {/* ← px-4 for equal spacing */}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full h-12 mb-1 transition-all duration-200 ${
                  isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50 text-foreground'
                } ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'}`}
                onClick={item.action}
              >
                <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : ''}`}>
                  <Icon 
                    className={`h-6 w-6 transition-transform ${
                      isActive ? 'scale-110' : ''
                    } ${isCollapsed ? '' : 'mr-3'}`}
                  />
                  {!isCollapsed && <span className="text-base">{item.label}</span>}
                </div>
              </Button>
            );
          })}
        </nav>

        {/* 🆕 FIX 3: SETTINGS - ICONS ONLY WHEN COLLAPSED */}
        <div className="border-t border-border p-2 relative" ref={settingsRef}>
          <Button
            variant="ghost"
            className={`w-full h-10 transition-all duration-200 hover:bg-accent/50 text-foreground ${
              isCollapsed ? 'justify-center px-0' : 'justify-start px-3'
            }`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : ''}`}>
              <MdSettings className={`h-6 w-6 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span className="text-base">Settings</span>}
            </div>
          </Button>

          {isSettingsOpen && (
            <div 
              className={`absolute bottom-full left-0 ${
                isCollapsed 
                  ? 'w-48 left-full ml-2'  // ← Right of collapsed sidebar
                  : 'w-48'
              } bg-surface border border-border rounded-md shadow-lg p-2 flex flex-col gap-2 z-50`}
            >
              {/* Edit Profile */}
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-10"
                onClick={() => {
                  setIsSettingsOpen(false);
                  navigate('/edit-profile');
                  setIsCollapsed(false);
                }}
              >
                <MdPerson className="h-4 w-4 mr-3" />
                Edit Profile
              </Button>

              {/* 🆕 Appearance Section */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-10"
                  onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                >
                  <MdSettings className="h-4 w-4 mr-3" />
                  Switch Appearance
                </Button>
                
                {isAppearanceOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-3 z-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MdSettings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">Dark Mode</span>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={handleThemeToggle}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-10 text-destructive"
                onClick={() => {
                  setIsSettingsOpen(false);
                  handleLogout();
                }}
              >
                <MdFavorite className="h-4 w-4 mr-3 text-destructive" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};



export default Sidebar;