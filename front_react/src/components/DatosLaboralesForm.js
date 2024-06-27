import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import './css/registro_form.css';

const DatosLaboralesForm = () => {
  const [form] = Form.useForm();
  const [successRedirect, setSuccessRedirect] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const datosLaborales = form.getFieldsValue();
      localStorage.setItem('datos_laborales', JSON.stringify(datosLaborales));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  const RegistrarDatosLaborales = async (values) => {
    try {
      localStorage.setItem('datosLaborales', JSON.stringify(values));
      setSuccessRedirect(true);
      
    } catch (error) {
      console.error('Error al enviar los datos laborales', error);
    }
  };

  return (
    <MainLayout>
      <h1>Información Laboral:</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={RegistrarDatosLaborales}
      >
        <Form.Item
          name="puesto"
          label="Puesto"
          rules={[{ required: true, message: 'Por favor, ingresa el puesto' }]}
        >
          <Input placeholder="Puesto" />
        </Form.Item>
        <Form.Item
          name="empresa"
          label="Empresa"
          rules={[{ required: true, message: 'Por favor, ingresa la empresa' }]}
        >
          <Input placeholder="Empresa" />
        </Form.Item>
        <Form.Item
          name="antiguedad"
          label="Antigüedad"
          rules={[{ required: true, message: 'Por favor, ingresa la antigüedad' }]}
        >
          <Input placeholder="Antigüedad" />
        </Form.Item>
        <Form.Item
          name="sueldo_in"
          label="Sueldo Inicial"
          rules={[{ required: true, message: 'Por favor, ingresa el sueldo inicial' }]}
        >
          <Input placeholder="Sueldo Inicial" />
        </Form.Item>
        <Form.Item
          name="sueldo_final"
          label="Sueldo Final"
          rules={[{ required: true, message: 'Por favor, ingresa el sueldo final' }]}
        >
          <Input placeholder="Sueldo Final" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Ingresar
          </Button>
        </Form.Item>
      </Form>
      {successRedirect && <Navigate to='/referencias' />}
    </MainLayout>
  );
};

export default DatosLaboralesForm;
