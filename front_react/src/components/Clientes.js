import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from './MainLayout';
import { Table, Tag, Button, Modal } from 'antd';

export const ClientesLista = () => {
  const [datos, setDatos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/listaClientes');
        if (response.status === 200) {
          
          setDatos(response.data.datos);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = async (clientName) => {
    try {
      const response = await axios.get(`http://localhost:8080/cliente/nombre/${clientName}`);
      if (response.status === 200) {
        setClienteActual(response.data);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching client data: ", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setClienteActual(null);
  };

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
    {
      title: 'Fecha de Inicio', 
      dataIndex: 'fechaInicio', 
      key: 'fechaInicio'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button onClick={() => handleOpenModal(record.nombre)}>Ver Detalles</Button>
      ),
    }
  ];

  const renderReferencias = (referencias, domicilios, celulares) => {
    if (!referencias || !domicilios || !celulares) return null;
    const referenciasList = JSON.parse(referencias);
    const domiciliosList = JSON.parse(domicilios);
    const celularesList = JSON.parse(celulares);
    
    return referenciasList.map((referencia, index) => (
      <li key={index}>
        <p>Referencia: {referencia}</p>
        <p>Dirección: {domiciliosList[index]}</p>
        <p>Celular: {celularesList[index]}</p>
      </li>
    ));
  };

  return (
    <MainLayout>
      <h1>Usuarios</h1>
      <Table dataSource={datos} columns={columns} />
      
      {clienteActual && (
        <Modal
          title="Información del Cliente"
          visible={modalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Cerrar
            </Button>
          ]}
        >
          <p>Nombre: {clienteActual.nombre}</p>
          <p>Dirección: {clienteActual.direccion}</p>
          <p>Teléfono: {clienteActual.telefono}</p>
          <p>Cumpleaños: {clienteActual.cumple}</p>
          <p>Colonia: {clienteActual.colonia}</p>
          <p>Puesto: {clienteActual.puesto}</p>
          <p>Empresa: {clienteActual.empresa}</p>
          <p>Antigüedad: {clienteActual.antiguedad}</p>
          <p>Sueldo Inicial: {clienteActual.sueldo_in}</p>
          <p>Sueldo Final: {clienteActual.sueldo_final}</p>
          
          
          <p>Referencias:</p>
          <ul style={{listStyle: 'none'}}>
            <li>{renderReferencias(clienteActual.referencia, clienteActual.referencia_dom, clienteActual.referencia_cel)}</li>
          </ul>
          <p>Monto: {clienteActual.monto}</p>
          <p>Fecha de Inicio: {clienteActual.fechaInicio}</p>
          <p>Frecuencia de Pago: {clienteActual.frecuenciaPago}</p>
          <p>Plazo: {clienteActual.plazo}</p>
          <p>Estado: {clienteActual.estado}</p>
        </Modal>
      )}
    </MainLayout>
  );
};
