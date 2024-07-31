import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const { Title } = Typography;

const HomePage = () => {
  const [permisos, setPermisos] = useState([]);

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
    { key: '/inicio', icon: '🏠', label: 'Inicio' },
    { key: '/registro', icon: '👤', label: 'Registro' },
    { key: '/pendientes', icon: '➕', label: 'Nuevo Crédito' },
    { key: '/indicador', icon: '📊', label: 'Pagos' },
    { key: '/clientes', icon: '👥', label: 'Clientes' },
    { key: '/solicitudes', icon: '💲', label: 'Solicitudes' },
    { key: '/movimientos', icon: '🔄', label: 'Movimientos' },
    { key: '/corteCaja', icon: '🧾', label: 'Corte de Caja' },
    { key: '/gastos', icon: '💲', label: 'Gastos' },
    { key: '/cobranza', icon: '💲', label: 'Cobranza' }
  ];

  return (
    <div className="homepage">
      <Title level={2} className="homepage-title">Dashboard</Title>
      <Row gutter={[16, 16]} justify="center">
        {permisos.map((permiso) => {
          const option = adminOptions.find(option => option.key === `/${permiso}`);
          return option ? (
            <Col span={8} xs={24} sm={12} md={8} lg={6} key={option.key}>
              <Link to={option.key} className="homepage-link">
                <Card
                  className="homepage-card"
                  bordered={false}
                  hoverable
                  cover={<div className="icon-container">{option.icon}</div>}
                >
                  <Card.Meta
                    title={option.label}
                    className="homepage-card-meta"
                  />
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
