import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import logo from './img/financiera.png';
import './css/navbar.css';

const { Header } = Layout;

export const NavBar = () => {
  const [usuario, setUsuario] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const getUsuario = () => {
      const storedUsuario = localStorage.getItem('usuario');
      if (storedUsuario) {
        setUsuario(storedUsuario);
      } else {
        setRedirect(true);
      }
    };
    getUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setRedirect(true);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <a href="/profile">{usuario}</a>
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Header className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo Financiamos" />
      </div>
      
      <Dropdown overlay={menu} className="user-menu">
        <Button icon={<UserOutlined />} />
      </Dropdown>
      <MenuOutlined className="menu-icon" />
    </Header>
  );
};

export default NavBar;
