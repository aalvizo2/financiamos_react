import React, { useEffect, useState } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Navigate, Link } from 'react-router-dom';
import logo from './img/financiera.png';
import './css/navbar.css';
import { RUTA } from '../route';
import axios from 'axios';

const { Header } = Layout;

export const NavBar = () => {
  const [usuario, setUsuario] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [role, setRole] = useState('');

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

  const getRoles = async () => {
    const usuario = localStorage.getItem('usuario');
    console.log('usuario obtenido', usuario);
    if (usuario) {
      const response = await axios.get(`${RUTA}/getRole/${usuario}`);
      setRole(response.data.Data.role);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setRedirect(true);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to='/profile'>{usuario}</Link>
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
      <div className="navbar-content">
        <div className="logo-container">
          <img src={logo} alt="Logo Financiamos" />
          <div className="user-info">
             <span>{usuario}</span>
              <span>{role}</span>
           </div>
        </div>
        
        <Dropdown overlay={menu} className="user-menu">
          <Button icon={<UserOutlined />} />
        </Dropdown>
       
      </div>
    </Header>
  );
};

export default NavBar;
