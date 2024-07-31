import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  PlusOutlined,
  FundProjectionScreenOutlined,
  SolutionOutlined,
  DollarCircleOutlined,
  HistoryOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/sidebar.css';
import { FaMoneyCheckAlt } from "react-icons/fa";

const { Sider } = Layout;

const SideBar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      onCollapse(true);
    }
  }, [isMobile, onCollapse]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const user = localStorage.getItem('usuario');
        if (user) {
          const response = await axios.get(`http://localhost:8080/get-roles/${user}`);
          const roleData = response.data.datos[0];
          const { permisos } = roleData;
          setPermisos(JSON.parse(permisos) || []);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };
    getRoles();
  }, []);

  const adminOptions = [
    { key: '/inicio', icon: <HomeOutlined />, label: 'Inicio' },
    { key: '/registro', icon: <UserOutlined />, label: 'Registro' },
    { key: '/pendientes', icon: <PlusOutlined />, label: 'Nuevo Crédito' },
    { key: '/indicador', icon: <FundProjectionScreenOutlined />, label: 'Pagos' },
    { key: '/clientes', icon: <SolutionOutlined />, label: 'Clientes' },
    { key: '/solicitudes', icon: <DollarCircleOutlined />, label: 'Solicitudes' },
    { key: '/movimientos', icon: <HistoryOutlined />, label: 'Movimientos' },
    { key: '/corteCaja', icon: <SnippetsOutlined />, label: 'Corte de Caja' },
    { key: '/cobranza', icon: <FaMoneyCheckAlt />, label: 'Cobranza' },
    { key: '/gastos', icon: <FaMoneyCheckAlt />, label: 'Gastos' }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{ backgroundColor: '#EB8114' }}
    >
      <Menu
        mode='inline'
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
      >
        {permisos.map((permiso) => {
          const option = adminOptions.find(option => option.key === `/${permiso}`);
          return option ? (
            <Menu.Item key={option.key} icon={option.icon}>
              <span>{option.label}</span>
              <Link to={option.key} />
            </Menu.Item>
          ) : null;
        })}
      </Menu>
    </Sider>
  );
};

export default SideBar;
