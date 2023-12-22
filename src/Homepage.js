// HomePage.js

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Customer from './Customer';
import Product from './Product';
import Report from './Report';
import './Homepage.css';
import ErrorBoundary from './ErrorBoundary';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <div className="sidebar">
          <h1>SPA Example</h1>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>Dashboard</button>
          <button className={activeTab === 'customer' ? 'active' : ''} onClick={() => handleTabChange('customer')}>Customer</button>
          <button className={activeTab === 'product' ? 'active' : ''} onClick={() => handleTabChange('product')}>Product</button>
          <button className={activeTab === 'report' ? 'active' : ''} onClick={() => handleTabChange('report')}>Report</button>
        </div>
        <div className="content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'customer' && <Customer />}
          {activeTab === 'product' && <Product />}
          {activeTab === 'report' && <Report />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
