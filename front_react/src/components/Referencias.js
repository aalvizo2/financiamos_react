import React, { useEffect, useState } from 'react';
import { Form, Button, message, Input } from 'antd';
import MainLayout from './MainLayout';
import { Navigate } from 'react-router-dom';

export const Referencias = () => {
  const [form] = Form.useForm();
  const [successRedirect, setSuccessRedirect] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const datos = form.getFieldsValue();
      localStorage.setItem('referencias', JSON.stringify(datos));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  const Registrar = async (values) => {
    try {
      localStorage.setItem('referencias', JSON.stringify(values));
      setSuccessRedirect(true);
      message.success('Referencias guardadas correctamente');
    } catch (error) {
      message.error('Error al subir las referencias');
    }
  };

  return (
    <MainLayout>
      <h1>Referencias Personales</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={Registrar}
      >
        <Form.List name="referencias">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={`Referencia ${index + 1}`}
                  required
                >
                  <Input.Group compact>
                    <Form.Item
                      {...field}
                      name={[field.name, 'referencia']}
                      fieldKey={[field.fieldKey, 'referencia']}
                      rules={[{ required: true, message: 'Nombre requerido' }]}
                      noStyle
                    >
                      <Input style={{ width: '33%' }} placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'referencia_dom']}
                      fieldKey={[field.fieldKey, 'referencia_dom']}
                      rules={[{ required: true, message: 'Domicilio requerido' }]}
                      noStyle
                    >
                      <Input style={{ width: '33%' }} placeholder="Domicilio" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'referencia_cel']}
                      fieldKey={[field.fieldKey, 'referencia_cel']}
                      rules={[{ required: true, message: 'Celular requerido' }]}
                      noStyle
                    >
                      <Input style={{ width: '33%' }} placeholder="Celular" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'parentezco']}
                      fieldKey={[field.fieldKey, 'parentezco']}
                      rules={[{ required: true, message: 'Parentezco' }]}
                      noStyle
                    >
                      <Input style={{ width: '33%' }} placeholder="Parentezco" />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)} type="link">Remove</Button>
                  </Input.Group>
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Agregar Referencia
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
      {successRedirect && <Navigate to='/documentos' />}
    </MainLayout>
  );
}
