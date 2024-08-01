import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, InputNumber, Button, Select, Layout, Typography, Input, message } from 'antd';
import MainLayout from './MainLayout';
import './css/registro_form.css';

const { Title } = Typography;
const { Option } = Select;

export const Solicitud = () => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date())); // Initialize with today's date
  const [form] = Form.useForm();

  // Function to format the date as "dd de MMMM de yyyy" (e.g., "20 de abril de 2024")
  function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  useEffect(() => {
    const usuario = localStorage.getItem('nombre_persona');
    setNombre(usuario);
  }, []);

  const actualizar = async (values) => {
    const montoConInteres = monto; // Calcular monto más el interés del 10%

    try {
      Swal.fire({
        icon: 'success',
        title: 'Éxito'
      });

      // Enviar los datos a la base de datos con el monto calculado con interés
      await axios.put('http://localhost:8080/solicitud', {
        nombre,
        monto: montoConInteres,
        frecuenciaPago: values.frecuenciaPago,
        fechaInicio,
        plazo: values.plazo
      });

      window.location.href = '/vista_previacredito';
    } catch (error) {
      message.success({message: 'Operación realizada con éxito'});
    }
  };

  const handleMontoChange = (value) => {
    if (value <= 2000000) {
      setMonto(value);
      form.setFieldsValue({ monto: value });
    }
  };

  return (
    <MainLayout>
      <Layout.Content style={{ padding: '0 50px', maxWidth: '600px', margin: '0 auto' }}>
        <Title level={2}>Monto del Préstamo para {nombre}</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={actualizar}
        >
          <Form.Item
            name="monto"
            label="Monto"
            rules={[
              {
                required: true,
                message: 'Por favor ingrese el monto'
              },
              {
                validator: (_, value) =>
                  value > 2000000 ? Promise.reject(new Error('Monto no puede ser mayor a 2,000,000.00 de pesos')) : Promise.resolve(),
              }
            ]}
          >
            <InputNumber
              placeholder="Monto"
              value={monto}
              onChange={handleMontoChange}
              min={0}
              max={2000000}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="frecuenciaPago" label="Frecuencia de Pago" rules={[{ required: true, message: 'Por favor seleccione la frecuencia de pago' }]}>
            <Select placeholder="Selecciona Frecuencia de Pago">
              <Option value="Quincenal">Quincenal</Option>
            </Select>
          </Form.Item>
          <Form.Item name="plazo" label="Plazo" rules={[{ required: true, message: 'Por favor seleccione el plazo' }]}>
            <Select placeholder="Selecciona Plazo">
              <Option value="6 meses">6 Meses</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Input type="hidden" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Ingresar Datos</Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </MainLayout>
  );
};
