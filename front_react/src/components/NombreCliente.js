import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Button, Layout, Typography } from 'antd';
import MainLayout from './MainLayout';
import './css/clientes.css';
import { useNavigate,} from 'react-router-dom';
import {RUTA} from '../route';

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;

export const NombreCliente = () => {
  const [nombres, setNombres] = useState([]);
  const [filteredNombres, setFilteredNombres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDatos = async () => {
      try {
        const response = await axios.get(`${RUTA}/datos`);
        if (response.status === 200) {
          setNombres(response.data.datos);
          setFilteredNombres(response.data.datos);
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
    navigate('/solicitud');
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = nombres.filter((dato) =>
      dato.nombre.toLowerCase().includes(value)
    );
    setFilteredNombres(filteredData);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => guardarUsuario(record.nombre)}>
          Nuevo Préstamo
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <Title level={2}>Clientes</Title>
        <Search
          placeholder="Buscar cliente"
          onChange={handleSearch}
          style={{ marginBottom: 20, maxWidth: 300 }}
        />
        <Table
          columns={columns}
          dataSource={filteredNombres}
          rowKey="nombre"
          pagination={{ pageSize: 10 }}
          responsive={true}
        />
      </Content>
    </MainLayout>
  );
};
