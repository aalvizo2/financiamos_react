import React, { useEffect, useState } from "react";
import { Table, Button, message } from 'antd'; 
import axios from 'axios';
import { ModalAcciones } from "./CobranzaModal";

export const ListadoClientes = () => {
  const [clientes, setClientes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false); 
  const [datoFila, setDatoFila] = useState(null);

  const getClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/cobranza');
      setClientes(response.data.datos);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClientes();
  }, []);

  const columns = [
    { title: 'Nombre Cliente', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Monto Total', dataIndex: 'monto', key: 'monto' }, 
    { title: 'Días de Atraso', dataIndex: 'dias_atraso', key: 'dias_atraso' },
    { title: 'Nota', dataIndex: 'nota', key: 'nota' },
    { title: 'Fecha de Pago', dataIndex: 'fechaPago', key: 'fechaPago' },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Button 
          onClick={() => AbrirModal(record)}
          type="primary">
          Acciones
        </Button>
      )
    }
  ];

  const AbrirModal = (record) => {
    setDatoFila(record);
    setModal(true);
  };

  const CerrarModal = () => {
    setModal(false);
  };

  const handleSubmit = async (updatedRecord) => {
    try {
      await axios.post('http://localhost:8080/actualizarNota', updatedRecord); 
      
      message.success('Datos actualizados con éxito');
      getClientes();
      CerrarModal();
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      message.error('Error al actualizar los datos');
    }
  };

  return (
    <>
      <h1>Listado de Clientes</h1>
      <Table dataSource={clientes} columns={columns} rowKey="nombre" loading={loading}/>
      <ModalAcciones
        visible={modal}
        onCancel={CerrarModal}
        datoFila={datoFila}
        onSubmit={handleSubmit}
      />
    </>
  );
};
