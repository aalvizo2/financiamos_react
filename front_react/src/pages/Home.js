import React, { useState } from 'react';
import '../components/css/home.css';
import logo from '../components/img/financiera.png';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Content } = Layout;

const MainBar = () => {
  return (
    <section className="mainbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
    </section>
  );
};

const LoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [successRedirect, setSuccessRedirect] = useState(false);

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:8080/auth', {
        usuario: values.usuario,
        pass: values.pass,
      });
      

      // Guardar el usuario en localStorage
      localStorage.setItem('usuario', values.usuario);

      setSuccessRedirect(true);
      setError('');
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      if (error.response && error.response.status === 401) {
        setError('Credenciales Incorrectas');
      } else {
        setError('Ocurrió un error. Por favor intenta más tarde');
      }
    }
  };

  return (
    <div className="formulario">
      <h1>Iniciar Sesión:</h1>
      {error && <Alert message={error} type="error" showIcon />}
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="usuario"
          rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Usuario"
            onChange={(e) => setUsuario(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="pass"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Contraseña"
            onChange={(e) => setPass(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Ingresar
          </Button>
          {successRedirect && <Navigate to="/inicio" />}
        </Form.Item>
      </Form>
    </div>
  );
};

export const Home = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <MainBar />
        <div className="content-container">
          <LoginForm />
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
