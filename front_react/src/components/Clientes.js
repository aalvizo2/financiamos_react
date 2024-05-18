import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag } from 'antd';

export const ClientesLista = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/listaClientes');
        if (response.status === 200) {
          console.log(response.data); // Verifica los datos recibidos
          setDatos(response.data.datos);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        let color = '';
        if (estado === 'Aprobado') {
          color = 'green';
        } else if (estado === 'Rechazado') {
          color = 'red';
        }
        return (
          <Tag color={color}>{estado}</Tag>
        );
      },
    },
  ];

  return (
    <div style={{ marginLeft: 260 }}>
        <h1>Usuarios</h1>
      <Table dataSource={datos} columns={columns} />
    </div>
  );
};
