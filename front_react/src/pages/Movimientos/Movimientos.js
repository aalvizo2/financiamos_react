import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, message } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';

const { Column } = Table;

export const Movimientos = () => {
  const [clientes, setClientes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [estadoCuenta, setEstadoCuenta] = useState(null);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lista-clientes');
      console.log('Respuesta de /lista-clientes:', response.data);  // Log response
      if (response.data && Array.isArray(response.data.datos)) {
        const clientesConFechasFormateadas = response.data.datos.map(cliente => ({
          ...cliente,
          ultima_fecha_pago: moment(cliente.ultima_fecha_pago).format('DD [de] MMMM [de] YYYY')
        }));
        setClientes(clientesConFechasFormateadas);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error('Error al obtener la lista de clientes:', error);
    }
  };

  const mostrarEstadoCuenta = async (cliente) => {
    try {
      const response = await axios.get(`http://localhost:8080/estado-cuenta/${cliente}`);
      console.log('Respuesta de /estado-cuenta:', response.data);  // Log response
      if (response.data && response.data.estadoCuenta) {
        setEstadoCuenta(response.data.estadoCuenta);
        setIsModalVisible(true);
      } else {
        message.error('No se pudo obtener el estado de cuenta');
      }
    } catch (error) {
      console.error('Error al obtener el estado de cuenta del cliente:', error);
      message.error('Error al obtener el estado de cuenta');
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <div className='container'>
        <Table dataSource={clientes} rowKey="nombre">
          <Column title="Nombre" dataIndex="nombre" key="nombre" />
          <Column
            title="Fechas de Pago"
            dataIndex="ultima_fecha_pago"
            key="ultima_fecha_pago"
          />
          <Column
            title="Acciones"
            key="acciones"
            render={(text, record) => (
              <Button type="primary" onClick={() => mostrarEstadoCuenta(record.nombre)}>
                Ver Estado de Cuenta
              </Button>
            )}
          />
        </Table>

        <Modal
          title="Estado de Cuenta"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {estadoCuenta && (
            <div>
              <h3>Cliente: {estadoCuenta.nombre}</h3>
              <p>Saldo: {estadoCuenta.abono}</p>
              <p>Movimientos: {moment(estadoCuenta.fecha_pago).format('DD [de] MMMM [de] YYYY')}</p>
              {/* Otros detalles del estado de cuenta */}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};
