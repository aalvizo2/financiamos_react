import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { Form, Input, Button, message, Select, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../../route';

const { Option } = Select;

const Profile = () => {
  const [roleUser, setRoleUser] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUsuario = async () => {
      try {
        const user = localStorage.getItem('usuario');
        if (user) {
          const response = await axios.get(`${RUTA}/check-user/${user}`);
          setRoleUser(response.data.role);
        }
      } catch (error) {
        message.error('Error al obtener el usuario');
      }
    };
    getUsuario();
  }, []);

  const createUser = async (values) => {
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
      if (user) {
        await axios.post(`${RUTA}/change-password`, { user, ...value });
        message.success('Contraseña cambiada exitosamente');
      }
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
      <div>
        {roleUser === 'admin' ? (
          <>
            <Form layout='vertical' onFinish={createUser}>
              <h1>Crear Usuario</h1>
              <Form.Item
                name="username"
                label="Nombre de Usuario"
                rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Rol"
                rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
              >
                <Select placeholder="Selecciona un rol">
                  <Option value='admin'>Administrador</Option>
                  <Option value='user'>Usuario</Option>
                  <Option value='ventas-campo'>Ventas Campo</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="permisos"
                label="Permisos"
                rules={[{ required: true, message: 'Por favor seleccione los permisos' }]}
              >
                <Checkbox.Group>
                  <Checkbox value="inicio">Inicio</Checkbox>
                  <Checkbox value="registro">Registro</Checkbox>
                  <Checkbox value="pendientes">Nuevo Crédito</Checkbox>
                  <Checkbox value="indicador">Pagos</Checkbox>
                  <Checkbox value="clientes">Clientes</Checkbox>
                  <Checkbox value="solicitudes">Solicitudes</Checkbox>
                  <Checkbox value="movimientos">Movimientos</Checkbox>
                  <Checkbox value="corteCaja">Corte de Caja</Checkbox>
                  <Checkbox value="cobranza">Cobranza</Checkbox>
                  <Checkbox value="gastos">Gastos</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Crear Usuario
                </Button>
              </Form.Item>
            </Form>

            <Form layout='vertical' onFinish={changePassword}>
              <h1>Cambiar Contraseña</h1>
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
              <Form.Item>
                <Button type='primary' htmlType='submit'>Cambiar Contraseña</Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <Form layout='vertical' onFinish={changePassword}>
            <h1>Cambiar Contraseña</h1>
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
            <Form.Item>
              <Button type='primary' htmlType='submit'>Cambiar Contraseña</Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
