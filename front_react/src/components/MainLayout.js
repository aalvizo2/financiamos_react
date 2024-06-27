import React, { useState } from 'react';
import { Layout } from 'antd';
import SideBar from './SideBar';
import NavBar from './NavBar';
import './css/sidebar.css';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar collapsed={collapsed} onCollapse={(collapsed) => setCollapsed(collapsed)} />
      <Layout>
        <NavBar />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 'calc(100vh - 64px - 48px)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
