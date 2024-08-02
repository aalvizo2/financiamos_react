import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { Form, Input, Button, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../../route';

const { Option } = Select;

const Profile = () => {
  const [roleUser, setRoleUser] = useState('');
  const navigate= useNavigate();

  useEffect(() => {
    const getUsuario = async () => {
      const user = localStorage.getItem('usuario');
      if (user) {
        try {
          const response = await axios.get(`${RUTA}/check-user/${user}`);
          setRoleUser(response.data.role);
        } catch (error) {
          message.error('Error al obtener el usuario');
        }
      }
    };

    getUsuario();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${RUTA}/create-user`, values);
      if (response.status === 200) {
        message.success(response.data.message);
        navigate('/inicio');
      } else {
        message.info(response.data.message);
      }
    } catch (error) {
      message.error('Error al crear usuario');
    }
  };

  const changePassword = async (value) => {
    try {
      const user = localStorage.getItem('usuario');
      await axios.put(`${RUTA}/update/${user}`, value);
      message.success('Contraseña cambiada correctamente');
      navigate('/inicio');
    } catch (error) {
      message.error('Error al cambiar la contraseña');
    }
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('pass') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden'));
    },
  });

  return (
    <MainLayout>
      {roleUser === 'admin' ? (
        <div className="profile-container">
          <h2>Crear Nuevo Usuario</h2>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="usuario"
              label="Nombre de Usuario"
              rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pass"
              label="Contraseña"
              rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="role"
              label="Rol"
              rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
            >
              <Select placeholder='Selecciona un Rol'>
                <Option value='cajero-administrador'>Caja</Option>
                <Option value='ventas-campo'>Ventas Campo</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Crear Usuario
              </Button>
            </Form.Item>
          </Form>

          <Form layout='vertical' onFinish={changePassword}>
            <h1>Cambiar contraseña</h1>
            <Form.Item
              name='pass'
              label='Contraseña Nueva'
              rules={[{ required: true, message: 'Favor de ingresar este campo' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='confirmPass'
              label='Repetir contraseña'
              dependencies={['pass']}
              rules={[
                { required: true, message: 'Por favor confirme la contraseña' },
                validateConfirmPassword,
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type='primary' htmlType='submit'>Cambiar Contraseña</Button>
          </Form>
        </div>
      ) : (
        <Form layout='vertical' onFinish={changePassword}>
          <h1>Cambiar contraseña</h1>
          <Form.Item
            name='pass'
            label='Contraseña Nueva'
            rules={[{ required: true, message: 'Favor de ingresar este campo' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='confirmPass'
            label='Repetir contraseña'
            dependencies={['pass']}
            rules={[
              { required: true, message: 'Por favor confirme la contraseña' },
              validateConfirmPassword,
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type='primary' htmlType='submit'>Cambiar Contraseña</Button>
        </Form>
      )}
    </MainLayout>
  );
};

export default Profile;

