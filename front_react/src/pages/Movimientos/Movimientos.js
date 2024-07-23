import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, message, Descriptions } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import MainLayout from '../../components/MainLayout';

const { Column } = Table;

export const Movimientos = () => {
  const [clientes, setClientes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [estadoCuenta, setEstadoCuenta] = useState([]);

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
     <MainLayout>
     
        <Table dataSource={clientes} rowKey="nombre">
          <Column title="Nombre" dataIndex="nombre" key="nombre" />
          <Column
            title="Última Fecha de Pago"
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
          width={800}
        >
          {estadoCuenta && estadoCuenta.length > 0 && (
            <div>
              <Descriptions title={`Cliente: ${estadoCuenta[0].nombre}`} bordered>
                <Descriptions.Item label="Saldo Actual">
                  {estadoCuenta.reduce((total, mov) => total + mov.abono, 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Última Fecha de Pago">
                  {moment(estadoCuenta[0].fecha_pago).format('DD [de] MMMM [de] YYYY')}
                </Descriptions.Item>
              </Descriptions>
              <Table
                dataSource={estadoCuenta}
                rowKey="fecha_pago"
                pagination={false}
                style={{ marginTop: 20 }}
              >
                <Column
                  title="Fecha de Pago"
                  dataIndex="fecha_pago"
                  key="fecha_pago"
                  render={(text) => moment(text).format('DD [de] MMMM [de] YYYY')}
                />
                <Column title="Abono" dataIndex="abono" key="abono" />
                <Column title='Abono Interes' dataIndex='interes' key='interes' />
                
              </Table>
            </div>
          )}
        </Modal>
        
     </MainLayout>
      
      
    </>
  );
};
