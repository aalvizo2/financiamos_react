import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import './css/registro_form.css';

const FormRegistro = () => {
  const [form] = Form.useForm();
  const [successRedirect, setSuccessRedirect] = useState(false);
  

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const datos = form.getFieldsValue();
      localStorage.setItem('datos', JSON.stringify(datos));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  const Registrar = async (values) => {
    try {
      localStorage.setItem('datos', JSON.stringify(values));
      setSuccessRedirect(true);
      
    } catch (error) {
      console.error('Error al enviar los datos', error);
    }
  };
 
  return (
    <MainLayout>
      <h1>Información Personal:</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={Registrar}
      >
        <Form.Item
          name="nombre"
          label="Nombre Completo"
          rules={[{ required: true, message: 'Por favor, ingresa tu nombre completo' }]}
        >
          <Input placeholder="Nombre Completo" />
        </Form.Item>
        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[{ required: true, message: 'Por favor, ingresa tu dirección' }]}
        >
          <Input placeholder="Dirección" />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Celular"
          rules={[{ required: true, message: 'Por favor, ingresa tu teléfono' }]}
        >
          <Input placeholder="Ingresa un número de Celular" />
        </Form.Item>
        
        
        <Form.Item
          name="colonia"
          label="Barrio"
          rules={[{ required: true, message: 'Por favor, ingresa tu Barrio' }]}
        >
          <Input placeholder="Barrio" />
        </Form.Item>
       
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Ingresar
          </Button>
        </Form.Item>
      </Form>
      {successRedirect && <Navigate to='/datos_laborales' />}
    </MainLayout>
  );
};

export default FormRegistro;
