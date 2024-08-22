import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import moment from 'moment';
import MainLayout from './MainLayout';
import 'moment/locale/es';
import { SearchOutlined } from '@ant-design/icons';
import { RUTA } from '../route';

const { Column } = Table;

const formatearPesos = (valor) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);
};

const obtenerFechaPagoMasCercana = () => {
  const hoy = moment();
  const dia = hoy.date();
  if (dia <= 15) {
    return hoy.date(15).format('DD [de] MMMM [de] YYYY');
  } else if (dia <= 30) {
    return hoy.date(30).format('DD [de] MMMM [de] YYYY');
  } else {
    return hoy.add(1, 'month').date(15).format('DD [de] MMMM [de] YYYY');
  }
};

export const Abono = () => {
  const [buscar, setBuscar] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form] = Form.useForm();
  const [todosLosDatos, setTodosLosDatos] = useState([]);

  useEffect(() => {
    // Cargar datos al principio
    const fetchData = async () => {
      try {
        const response = await axios.post(`${RUTA}/filtrarCliente`);
        if (response.data && Array.isArray(response.data.resultados)) {
          const datosFormateados = response.data.resultados.map(cliente => ({
            ...cliente,
            monto: Math.round(cliente.monto),
            fechaInicio: moment(cliente.fechaInicio, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY'),
            fechaPago: cliente.fechaPago
              ? moment(cliente.fechaPago, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY')
              : obtenerFechaPagoMasCercana()
          }));
          setTodosLosDatos(datosFormateados);
          setResultados(datosFormateados);
        } else {
          setResultados([]);
          setTodosLosDatos([]);
        }
      } catch (err) {
        console.error('Error al buscar usuarios:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar datos en tiempo real
    const filteredData = todosLosDatos.filter(cliente =>
      cliente.nombre.toLowerCase().includes(buscar.toLowerCase())
    );
    setResultados(filteredData);
  }, [buscar, todosLosDatos]);

  const pagar = (record) => {
    setSelectedClient(record);
    form.setFieldsValue({
      interes: Math.round(record.monto * 0.1),
      abonoCapital: 0
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const { abono, interes } = await form.validateFields();
      const abonoCapital = abono > 0 ? Math.round(abono) : 0;
      const updatedMonto = Math.round(selectedClient.monto - abonoCapital);
      const updatedFechaInicio = moment().format('DD [de] MMMM [de] YYYY');
      const today = moment();
      
      // Ajusta la lógica de fechas para que coincida con el rango esperado
      let updatedFechaPago;
      
      if (today.date() <= 15) {
        updatedFechaPago = today.date(30).format('DD [de] MMMM [de] YYYY');
      } else {
        updatedFechaPago = today.add(1, 'month').date(15).format('DD [de] MMMM [de] YYYY');
      }
  
      const formData = {
        nombre: selectedClient.nombre,
        monto: updatedMonto,
        fechaInicio: updatedFechaInicio,
        fechaPago: updatedFechaPago,
        abono,
        interes, // Mantén el interés aquí para enviarlo al backend
        abonoCapital
      }
      
      await axios.post(`${RUTA}/actualizarPago`, formData);
  
      console.log('Datos a enviar', formData);
  
      setResultados(resultados.map(cliente =>
        cliente.nombre === selectedClient.nombre
          ? { ...cliente, monto: updatedMonto, fechaInicio: updatedFechaInicio, fechaPago: updatedFechaPago, interes: 0 } // Reiniciar interés en el estado local
          : cliente
      ));
  
      setIsModalVisible(false);
      message.success('Pago registrado con éxito');
      
      // Reiniciar el campo de interés en el formulario
    
  
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
    //const fechaInicioMoment = moment(fechaInicio, 'DD [de] MMMM [de] YYYY');
    return moment().diff(fechaPagoMoment, 'days') > 1 && moment().isAfter(fechaPagoMoment);
  };

  return (
    <MainLayout>
      <Form layout="inline">
        <Form.Item name="buscar">
          <Input 
            type='text'
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder='Buscar un Cliente' 
            prefix={<SearchOutlined />}
          />
        </Form.Item>
      </Form>

      <Table dataSource={resultados} rowKey="nombre" pagination={true} className='table-responsive'>
        <Column title="Nombre" dataIndex="nombre" key="nombre" />
        <Column 
          title="Monto" 
          dataIndex="monto" 
          key="monto" 
          render={(text) => text <= 0 ? 'Préstamo Liquidado' : formatearPesos(text)} 
        />
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
            label="Capital"
            rules={[{ required: false, message: 'Por favor ingrese el abono' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="interes"
            label="Interés"
            rules={[{ required: false, message: 'Por favor ingrese el interés' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};
