import React, { useState, useEffect } from 'react';
import { Route, Link, Redirect, Routes } from 'react-router-dom';
import LogoComponent from './LogoComponent';
import MainComponent from './MainComponent';
import StationComponent from './StationComponent';
import MobilityComponent from './MobilityComponent';
import UsersComponent from './UsersComponent';
import BatStatusComponent from './BatStatusComponent';
const HomeTabComponent = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to 'MAIN'

  const tabs = [
    { id: 0, title: 'LOGO', color: 'red', path: '/logo' },
    { id: 1, title: 'MAIN', color: 'orange', path: '/main' },
    { id: 2, title: 'STATION', color: 'yellow', path: '/station' },
    { id: 3, title: 'MOBILITY', color: 'green', path: '/mobility' },
    { id: 4, title: 'USERS', color: 'blue', path: '/users' },
    { id: 5, title: 'BAT STATUS', color: 'purple', path: '/batstatus' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            style={{
              padding: '10px 20px',
              cursor: tab.id === 0 ? 'default' : 'pointer', // 로고 탭은 클릭 기능 비활성화
              borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : 'none',
              color: activeTab === tab.id ? 'red' : 'black',
              backgroundColor: 'white',
              borderRadius: '10px 10px 0 0',
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </Link>
        ))}
      </div>
      <Routes path="/logo" component={LogoComponent} />
      <Routes path="/main" component={MainComponent} />
      <Routes path="/station" component={StationComponent} />
      <Routes path="/mobility" component={MobilityComponent} />
      <Routes path="/users" component={UsersComponent} />
      <Routes path="/batstatus" component={BatStatusComponent} />
      {/* <Redirect from="/" to="/logo" /> */}
    </div>
  );
};

export default HomeTabComponent;
