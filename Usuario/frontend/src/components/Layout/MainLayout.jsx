import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;