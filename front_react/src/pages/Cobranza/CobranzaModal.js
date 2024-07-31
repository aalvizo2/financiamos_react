import React, { useEffect, useState } from "react";
import { Modal, Input, Form, Tabs } from 'antd';
import TextArea from "antd/es/input/TextArea";

const { TabPane } = Tabs;

export const ModalAcciones = ({ visible, onCancel, datoFila, onSubmit }) => {
  const [form] = Form.useForm();
  const [isPayment, setIsPayment]= useState(false);

  useEffect(() => {
    if (datoFila) {
      form.setFieldsValue(datoFila);
    }
  }, [form, datoFila]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({
        ...datoFila,
        ...values
      });
      onCancel();
    });
  };
 
  const handlePaymentData= ()=>{
     setIsPayment(true); 
     form.validateFields().then(values=>{
         onSubmit({...values});
     });
   
  }
  return (
    <Modal
      visible={visible}
      onOk={isPayment? handlePaymentData: handleSubmit}
      okText='Guardar'
      cancelText='Cancelar'
      title='Editar Estatus/Nota'
      onCancel={onCancel}
    >
      <Tabs defaultActiveKey="1" isPayment={true}>
        <TabPane tab='Datos Cobro' key="1">
          <Form form={form} layout="vertical">
            <Form.Item
              name='nombre'
              label='Nombre'
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='monto'
              label='Monto'
              rules={[{ required: true, message: 'Por favor ingrese el monto' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='dias_atraso'
              label='Días de Atraso'
              rules={[{ required: true, message: 'Por favor ingrese los días de atraso' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='nota'
              label='Nota'
              rules={[{ required: true, message: 'Por favor ingrese una nota' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name='fechaPago'
              label='Fecha de Pago'
              rules={[{ required: true, message: 'Por favor ingrese la fecha de pago' }]}
            >
              <Input disabled />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab='Realizar Pago' key='2'>
          <Form form={form} layout="vertical">
             <Form.Item
                name='abono'
                label='Abono'
                rules={[{
                   required: true, 
                   
                   pattern: /^(?!-)\d*$/,
                   message: 'Favor de no Ingresar signos negativos'
                }]}
             >
               <Input type="number" />
             </Form.Item>
             <Form.Item
                name='interes'
                label='Interes'
                rules={[{
                   required: true, 
                   
                   pattern: /^(?!-)\d*$/,
                   message: 'Favor de no Ingresar signos negativos'
                }]}
             >
               <Input type="number" />
             </Form.Item>
          </Form>
          
        </TabPane>
      </Tabs>
    </Modal>
  );
};
