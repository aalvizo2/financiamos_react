import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, Button, Layout } from 'antd';
import MainLayout from './MainLayout';
import './css/clientes.css';

const { Title } = Typography;
const { Content } = Layout;

export const NombreCliente = () => {
  const [nombres, setNombres] = useState([]);
  
  useEffect(() => {
    const getDatos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/datos');
        if (response.status === 200) {
          setNombres(response.data.datos);
        } else {
          console.error('Error al obtener los datos');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    getDatos();
  }, []);

  const guardarUsuario = (nombre) => {
    localStorage.setItem('nombre_persona', nombre);
    window.location.href = '/solicitud';
  };

  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        
          <Title level={2}>Clientes</Title>
          <List
            bordered
            dataSource={nombres}
            renderItem={(dato) => (
              <List.Item>
                <div className="list-item-content">
                  {dato.nombre}
                  <Button type="primary" onClick={() => guardarUsuario(dato.nombre)}>Nuevo Préstamo</Button>
                </div>
              </List.Item>
            )}
          />
        
      </Content>
    </MainLayout>
  );
};
