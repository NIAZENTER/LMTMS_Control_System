import React, { useState, useEffect } from 'react';

const HomeTabComponent = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to 'MAIN'
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const tabs = [
    { id: 0, title: 'LOGO', color: 'red' },
    { id: 1, title: 'MAIN', color: 'orange' },
    { id: 2, title: 'STATION', color: 'yellow' },
    { id: 3, title: 'MOBILITY', color: 'green' },
    { id: 4, title: 'USERS', color: 'blue' },
    { id: 5, title: 'BAT STATUS', color: 'purple' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleResize = () => {
    setContentWidth(window.innerWidth - 40); // 40px은 데스크탑 좌우 간격을 고려한 값
    setContentHeight(window.innerHeight - 150); // 150px은 탭 부분의 높이와 상하 간격을 고려한 값
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <div style={{ padding: '20px' }}>LOGO content goes here</div>;
      case 1:
        return <div style={{ padding: '20px' }}>MAIN content goes here</div>;
      case 2:
        return <div style={{ padding: '20px' }}>STATION content goes here</div>;
      case 3:
        return <div style={{ padding: '20px' }}>MOBILITY content goes here</div>;
      case 4:
        return <div style={{ padding: '20px' }}>USERS content goes here</div>;
      case 5:
        return <div style={{ padding: '20px' }}>BAT STATUS content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              padding: '30px 20px',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : 'none',
              color: activeTab === tab.id ? 'red' : 'black',
              backgroundColor: 'white',
              borderRadius: '10px 10px 0 0',
            }}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div style={{ width: '90%', border: '2px solid black', padding: '30px', marginTop: '10px', borderRadius: '10px', height: contentHeight, backgroundColor: 'white' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HomeTabComponent;
