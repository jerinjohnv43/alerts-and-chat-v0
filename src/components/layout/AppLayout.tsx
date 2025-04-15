
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex flex-col lg:pl-64">
        <AppHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
