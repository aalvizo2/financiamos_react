import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [permisos, setPermisos] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const getRoles = async () => {
      try {
        const user = localStorage.getItem('usuario');
        if (user) {
          const response = await axios.get(`http://localhost:8080/get-roles/${user}`);
          const roleData = response.data.datos[0];
          const { role, permisos } = roleData;
          setRole(role);
          setPermisos(JSON.parse(permisos) || []);
          console.log('permisos del usuario', JSON.parse(permisos));
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };
    getRoles();
  }, []);

  const adminOptions = [
    { key: '/inicio', icon: '🏠', label: 'Inicio' },
    { key: '/registro', icon: '👤', label: 'Registro' },
    { key: '/pendientes', icon: '➕', label: 'Nuevo Crédito' },
    { key: '/indicador', icon: '📊', label: 'Pagos' },
    { key: '/clientes', icon: '👥', label: 'Clientes' },
    { key: '/solicitudes', icon: '💲', label: 'Solicitudes' },
    { key: '/movimientos', icon: '🔄', label: 'Movimientos' },
    { key: '/corteCaja', icon: '🧾', label: 'Corte de Caja' },
  ];

  return (
    <div className="homepage">
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        {permisos.map((permiso) => {
          const option = adminOptions.find(option => option.key === `/${permiso}`);
          return option ? (
            <Col span={8} key={option.key}>
              <Link to={option.key}>
                <Card title={option.label} bordered={false}>
                  <div className="icon">{option.icon}</div>
                </Card>
              </Link>
            </Col>
          ) : null;
        })}
      </Row>
    </div>
  );
};

export default HomePage;
