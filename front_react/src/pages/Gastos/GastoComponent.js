import React, { useState, useEffect } from 'react';
import { Table, Form, InputNumber, Select, Button, DatePicker, message, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import {RUTA} from '../../route';

moment.locale('es');

const { Option } = Select;

export const GastoComponent = () => {
  const [gastos, setGastos] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get(`${RUTA}/mostrarGasto`);
      setGastos(response.data.Data);
    } catch (error) {
      message.error('Error al cargar los gastos');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        fecha: moment(values.fecha).format('LL'),
      };
      const response = await axios.post(`${RUTA}/generarGasto`, formattedValues);
      message.success(response.data.message);
      form.resetFields();
      fetchGastos();
    } catch (error) {
      message.error('Error al agregar el gasto');
    }
  };

  const columns = [
    {
      title: 'Tipo de Gasto',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Cantidad',
      dataIndex: 'monto',
      key: 'monto',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
  ];

  return (
    <>
      <h1>Control de Gastos</h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="tipoGasto"
              label="Tipo de Gasto"
              rules={[{ required: true, message: 'Por favor selecciona un tipo de gasto' }]}
            >
              <Select style={{ width: '100%' }}>
                <Option value="Gasolina Calle">Gasolina Calle</Option>
                <Option value="Nomina">Nomina</Option>
                <Option value="Gasolina Sebas">Gasolina Sebas</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="cantidad"
              label="Cantidad"
              rules={[{ required: true, message: 'Por favor ingresa la cantidad' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="fecha"
              label="Fecha"
              rules={[{ required: true, message: 'Por favor selecciona la fecha' }]}
            >
              <DatePicker locale={locale} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Agregar Gasto
          </Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={gastos}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
    </>
  );
};
