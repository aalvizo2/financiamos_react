import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import moment from 'moment';
import MainLayout from './MainLayout'
import 'moment/locale/es';
import { SearchOutlined } from '@ant-design/icons';

const { Column } = Table;

export const Abono = () => {
  const [buscar, setBuscar] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form] = Form.useForm();
  const [todosLosDatos, setTodosLosDatos] = useState([]); // Define una variable para almacenar todos los datos

  const formulario = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/filtrarCliente', { buscar: values.buscar });
      if (response.data && Array.isArray(response.data.resultados)) {
        const datosFormateados = response.data.resultados.map(cliente => ({
          ...cliente,
          fechaInicio: moment(cliente.fechaInicio, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY'),
          fechaPago: moment(cliente.fechaPago, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY')
        }));
        setResultados(datosFormateados);
        setTodosLosDatos(datosFormateados); // Actualiza todosLosDatos con los datos filtrados
      } else {
        setResultados([]);
        setTodosLosDatos([]); // En caso de que no haya resultados, reinicia todosLosDatos
      }
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
    }
  };

  const pagar = (record) => {
    setSelectedClient(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const { abono } = await form.validateFields();
      const updatedMonto = selectedClient.monto - abono;
      const updatedFechaInicio = moment().format('DD [de] MMMM [de] YYYY');
      const updatedFechaPago = selectedClient.frecuenciaPago === 'Quincenal'
        ? moment().add(15, 'days').format('DD [de] MMMM [de] YYYY')
        : moment().add(1, 'month').format('DD [de] MMMM [de] YYYY');

      await axios.post('http://localhost:8080/actualizarPago', {
        nombre: selectedClient.nombre,
        monto: updatedMonto,
        fechaInicio: updatedFechaInicio,
        fechaPago: updatedFechaPago,
        abono: abono
      });

      setResultados(resultados.map(cliente =>
        cliente.nombre === selectedClient.nombre
          ? { ...cliente, monto: updatedMonto, fechaInicio: updatedFechaInicio, fechaPago: updatedFechaPago }
          : cliente
      ));

      setIsModalVisible(false);
      message.success('Pago registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      message.error('Error al registrar el pago');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isFechaPagoAtrasada = (fechaPago, fechaInicio) => {
    const fechaPagoMoment = moment(fechaPago, 'DD [de] MMMM [de] YYYY');
    const fechaInicioMoment = moment(fechaInicio, 'DD [de] MMMM [de] YYYY');
    return moment().diff(fechaPagoMoment, 'days') > 7 && moment().isAfter(fechaPagoMoment);
  };

  return (
    <MainLayout>
        
      <Form layout="inline" onFinish={formulario}>
        <Form.Item name="buscar">
          <Input 
            type='text'
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder='Buscar un Cliente' 
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Buscar
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={resultados} rowKey="nombre">
        <Column title="Nombre" dataIndex="nombre" key="nombre" />
        <Column title="Monto" dataIndex="monto" key="monto" />
        <Column title="Fecha de Inicio" dataIndex="fechaInicio" key="fechaInicio" />
        <Column
          title="Fecha de Pago"
          dataIndex="fechaPago"
          key="fechaPago"
          render={(text, record) => (
            <span style={{ color: isFechaPagoAtrasada(record.fechaPago, record.fechaInicio) ? 'red' : 'black' }}>
              {record.fechaPago}
            </span>
          )}
        />
        <Column
          title="Acciones"
          key="acciones"
          render={(text, record) => (
            <Button type="primary" onClick={() => pagar(record)}>
              Abono
            </Button>
          )}
        />
      </Table>

      <Modal
        title="Registrar Abono"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="abono"
            label="Abono"
            rules={[{ required: true, message: 'Por favor ingrese el abono' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
     
    </MainLayout>
    
  );
};
