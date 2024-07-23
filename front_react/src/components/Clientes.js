import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from './MainLayout';
import { Table, Tag, Button, Modal, Form, Input, Row, Col, Image, message } from 'antd';

const { TextArea } = Input;

export const ClientesLista = () => {
  const [datos, setDatos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/listaClientes');
      if (response.status === 200) {
        setDatos(response.data.datos);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = async (clientName) => {
    try {
      const response = await axios.get(`http://localhost:8080/cliente/nombre/${clientName}`);
      if (response.status === 200) {
        setClienteActual(response.data);
        form.setFieldsValue(response.data); // Set form values
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching client data: ", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setClienteActual(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        values.id = clienteActual.id;  // Asegúrate de que `id` esté disponible en clienteActual
        
        axios.put('http://localhost:8080/updateCliente', values)
          .then(response => {
            if (response.status === 200) {
              message.success('Cliente actualizado correctamente');
              handleCloseModal();
              fetchData();
            }
          })
          .catch(error => {
            console.error("Error updating client data: ", error);
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        let color = '';
        if (estado === 'Aprobado') {
          color = 'green';
        } else if (estado === 'Rechazado') {
          color = 'red';
        }
        return (
          <Tag color={color}>{estado}</Tag>
        );
      },
    },
    {
      title: 'Fecha de Inicio',
      dataIndex: 'fechaInicio',
      key: 'fechaInicio'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button onClick={() => handleOpenModal(record.nombre)}>Ver Detalles</Button>
      ),
    }
  ];

  const renderReferencias = (referencias, domicilios, celulares) => {
    if (!referencias || !domicilios || !celulares) return null;
    const referenciasList = JSON.parse(referencias);
    const domiciliosList = JSON.parse(domicilios);
    const celularesList = JSON.parse(celulares);

    return referenciasList.map((referencia, index) => (
      <div key={index} style={{ marginBottom: '10px' }}>
        <p><strong>Referencia:</strong> {referencia}</p>
        <p><strong>Dirección:</strong> {domiciliosList[index]}</p>
        <p><strong>Celular:</strong> {celularesList[index]}</p>
      </div>
    ));
  };

  return (
    <MainLayout>
      <h1>Usuarios</h1>
      <Table dataSource={datos} columns={columns} />

      {clienteActual && (
        <Modal
          title="Registrar Usuario"
          visible={modalVisible}
          onCancel={handleCloseModal}
          footer={[
            isEditing && (
              <Button key="save" type="primary" onClick={handleSave}>
                Guardar
              </Button>
            ),
            !isEditing && (
              <Button key="edit" type="default" onClick={handleEdit}>
                Editar Información
              </Button>
            ),
            <Button key="close" onClick={handleCloseModal}>
              Cerrar
            </Button>,
          ]}
          width={1200} // Ajusta el ancho del modal si es necesario
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={clienteActual}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="usuario" label="Usuario" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="rol" label="Rol" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="correo" label="Correo" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="nombre" label="Nombre" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="apellidoPaterno" label="Apellido Paterno" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="apellidoMaterno" label="Apellido Materno" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="telefono" label="Teléfono" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="curp" label="CURP" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="fechaNacimiento" label="Fecha de Nacimiento" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="genero" label="Género" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <h3>Referencias</h3>
                <Form.Item label="Referencias">
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {renderReferencias(clienteActual.referencia, clienteActual.referencia_dom, clienteActual.referencia_cel)}
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <h3>Imágenes</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {clienteActual.cedula && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/cedula/${clienteActual.cedula}`}
                      alt="Cédula"
                    />
                  )}
                  {clienteActual.carta_laboral && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/carta-laboral/${clienteActual.carta_laboral}`}
                      alt="Carta Laboral"
                    />
                  )}
                  {clienteActual.formato_referencias && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/formato-referencias/${clienteActual.formato_referencias}`}
                      alt="Formato Referencias"
                    />
                  )}
                  {clienteActual.pagare && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/pagare/${clienteActual.pagare}`}
                      alt="Pagaré"
                    />
                  )}
                  {clienteActual.referencia_familiar && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/referencia-familiar/${clienteActual.referencia_familiar}`}
                      alt="Referencia Familiar"
                    />
                  )}
                  {clienteActual.referencia_laboral && (
                    <Image
                      width={100}
                      src={`http://localhost:8080/referencia-laboral/${clienteActual.referencia_laboral}`}
                      alt="Referencia Laboral"
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </MainLayout>
  );
};
