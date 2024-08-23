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
import { RUTA } from '../route';

const { Sider } = Layout;

const SideBar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [permisos, setPermisos] = useState([]);
  const [numSolicitudesPendientes, setNumSolicitudesPendientes] = useState('');
  const [collapsedState, setCollapsedState] = useState(isMobile);
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Update the collapsed state based on screen size
    if (isMobile) {
      setCollapsedState(true);
    } else {
      setCollapsedState(collapsed);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, collapsed]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const user = localStorage.getItem('usuario');
        if (user) {
          const response = await axios.get(`${RUTA}/get-roles/${user}`);
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

  useEffect(() => {
    const solicitudesGuardadas = localStorage.getItem('solicitudesPendientes');
    if (solicitudesGuardadas) {
      const solicitudes = JSON.parse(solicitudesGuardadas);
      setNumSolicitudesPendientes(solicitudes.length);
    }
  }, []);

  const adminOptions = [
    { key: '/inicio', icon: <HomeOutlined />, label: 'Inicio' },
    { key: '/registro', icon: <UserOutlined />, label: 'Registro' },
    { key: '/pendientes', icon: <PlusOutlined />, label: 'Nuevo Crédito' },
    { key: '/indicador', icon: <FundProjectionScreenOutlined />, label: 'Pagos' },
    { key: '/clientes', icon: <SolutionOutlined />, label: 'Clientes' },
    { 
      key: '/solicitudes', 
      icon: <DollarCircleOutlined />, 
      label: 'Solicitudes', 
      count: numSolicitudesPendientes > 0 ? numSolicitudesPendientes : null
    },
    { key: '/movimientos', icon: <HistoryOutlined />, label: 'Movimientos' },
    { key: '/corteCaja', icon: <SnippetsOutlined />, label: 'Corte de Caja' },
    { key: '/cobranza', icon: <FaMoneyCheckAlt />, label: 'Cobranza' },
    { key: '/gastos', icon: <FaMoneyCheckAlt />, label: 'Gastos' }
  ];

  // Handle collapse toggle
  const handleCollapseToggle = (collapsed) => {
    setCollapsedState(collapsed);
    onCollapse(collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsedState}
      onCollapse={handleCollapseToggle}
      style={{ backgroundColor: '#EB8114' }}
    >
      <Menu
        mode='inline'
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
        onSelect={({ key }) => setSelectedKey(key)}
      >
        {permisos.map((permiso) => {
          const option = adminOptions.find(option => option.key === `/${permiso}`);
          return option ? (
            <Menu.Item key={option.key} icon={option.icon}>
              <span style={{ 
                color: selectedKey === option.key ? '#EB8114' : 'inherit', // Change color when selected
              }}>
                {option.label} 
                {option.count && option.count > 0 && (
                  <span style={{ 
                    color: selectedKey === option.key ? '#EB8114' : 'white', // Match color with menu item when selected
                    fontSize: collapsed ? '10px' : '12px',
                    marginLeft: '5px'
                  }}>
                    ({option.count})
                  </span>
                )}
              </span>
              <Link to={option.key} />
            </Menu.Item>
          ) : null;
        })}
      </Menu>
    </Sider>
  );
};

export default SideBar;
