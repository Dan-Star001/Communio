import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import BottomNavigation from './BottomNavigation';
import CreatePostModal from '../modals/CreatePostModal';

const Layout = ({ children }) => {
  const { isCreateModalOpen } = useSelector((state) => state.ui);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Navigation */}
      <TopNavigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <div className="flex-1 pt-14 pb-16 lg:pt-0 lg:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </main>

      {/* Create Post Modal */}
      {isCreateModalOpen && <CreatePostModal />}
    </div>
  );
};

export default Layout;
