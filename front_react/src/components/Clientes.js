import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from './MainLayout';
import { Table, Tag, Button, Modal, Form, Input, Row, Col, Image, message, Flex, Upload } from 'antd';
import {UploadOutlined} from '@ant-design/icons';


const { TextArea } = Input;

export const ClientesLista = () => {
  const [datos, setDatos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteActual, setClienteActual] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [filteredDatos, setFilteredDatos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();
  const [isAprovado, setIsAprobado] = useState(false);
  //const [imageUrl, setImageUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  // Fetch data from the API
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

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Open the modal and fetch client data
  const handleOpenModal = async (clientName) => {
    try {
      const response = await axios.get(`http://localhost:8080/cliente/nombre/${clientName}`);
      if (response.status === 200) {
        setClienteActual(response.data);
        form.setFieldsValue(response.data); // Set form values
        setModalVisible(true);
        getDocumentos(clientName);
        const cliente= response.data;
        if(cliente.estado === 'Aprobado'){
           setIsAprobado(true)
        }else{
           setIsAprobado(false)
        }
      }
    } catch (error) {
      console.error("Error fetching client data: ", error);
    }
  };

  const getDocumentos = async (clientName) => {
    try {
      const response = await axios.get(`http://localhost:8080/getImages/${clientName}`);
      setDocumentos(response.data.Data);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  // Close the modal and reset state
  const handleCloseModal = () => {
    setModalVisible(false);
    setClienteActual(null);
    setIsEditing(false);
  };

  // Enable editing mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save the updated client data
  const handleSave = () => {
    form.validateFields()
      .then(values => {
        values.id = clienteActual.id; // Ensure `id` is available in clienteActual

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

  // Table columns configuration
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
      key: 'fechaInicio',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <Button onClick={() => handleOpenModal(record.nombre)}>Ver Detalles</Button>
      ),
    }
  ];
  

    // Handle file upload
    const beforeUpload = (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Solo puedes subir archivos JPG/PNG!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('La imagen debe ser menor a 2MB!');
      }
      return isJpgOrPng && isLt2M;
    };
  
    const handleUploadChange = async ({ file, fileList }) => {
      if (file.status === 'done') {
        const updatedImageUrls = { ...imageUrls, [file.name]: URL.createObjectURL(file.originFileObj) };
        setImageUrls(updatedImageUrls);
      }
    };
  
    const handleSubmit = async () => {
      try {
        // Lógica para guardar el estado actual del cliente
        // Aquí puedes usar form.getFieldsValue() para obtener los valores actuales del formulario
        const values = form.getFieldsValue();
        await axios.post(`http://localhost:8080/saveCliente/${clienteActual.nombre}`, values);
        message.success('Datos guardados con éxito');
      } catch (error) {
        console.error("Error saving data: ", error);
        message.error('Error al guardar los datos');
      }
    };
  

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


  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    // Filter data based on the search term
    const filtered = datos.filter(cliente =>
      cliente.nombre.toLowerCase().includes(value)
    );
    setFilteredDatos(filtered);
  };

  return (
    <MainLayout>
      <h1>Usuarios</h1>
      <Input
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '16px', width: '300px' }}
      />
      <Table dataSource={filteredDatos} columns={columns} />

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
          width={1200} // Adjust modal width if necessary
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={clienteActual}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nombre" label="Nombre" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="direccion" label="Dirección" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="telefono" label="Teléfono" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="colonia" label="Colonia" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="puesto" label="Puesto" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="empresa" label="Empresa" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="antiguedad" label="Antigüedad" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name='redes_sociales' label='Redes Sociales' style={{ marginBottom: '8px' }}>
                  <TextArea disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sueldo_in" label="Sueldo Inicial" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="sueldo_final" label="Sueldo Final" style={{ marginBottom: '8px' }}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item name="monto" label="Monto" style={{ marginBottom: '8px' }}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="fechaInicio" label="Fecha de Inicio" style={{ marginBottom: '8px' }}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="frecuenciaPago" label="Frecuencia de Pago" style={{ marginBottom: '8px' }}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="plazo" label="Plazo" style={{ marginBottom: '8px' }}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="estado" label="Estado" style={{ marginBottom: '8px' }}>
                  <Input disabled />
                </Form.Item>

                {documentos.map((documento) => {
  const isAprobado = clienteActual && clienteActual.estado === 'Aprobado';
  return (
    <div key={documento.id}>
      {documento.desembolso != null ? (
        <div></div>
      ) : (
        isAprobado ? (
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            customRequest={async ({ file, onSuccess }) => {
              const formData = new FormData();
              formData.append('file', file);
              try {
                const response = await axios.post(`http://localhost:8080/subirDesembolso/${clienteActual.nombre}`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
                if (response.status === 200) {
                  onSuccess();
                  message.success('Operación realizada con éxito');
                  handleCloseModal();
                }
              } catch (error) {
                console.error("Error uploading file: ", error);
                message.error(`Error al subir ${file.name}`);
              }
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
          </Upload>
        ) : (
          <div>No permitido subir desembolso, cliente no aprobado.</div>
        )
      )}
    </div>
  );
})}
          
              </Col>
              <Col span={24}>
                <h3>Referencias</h3>
                <Form.Item>
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
                  {documentos.map((documento) =>(
                    <Image
                       key={documento.pagare}
                       width={100}
                       src={`http://localhost:8080/pagare/${documento.pagare}`}
                      alt="Carta Laboral"
                   />
                  
                  ))}

                  {documentos.map((documento) =>(
                    <Image
                       key={documento.formato_referencias}
                       width={100}
                       src={`http://localhost:8080/formato-referencias/${documento.formato_referencias}`}
                      alt="Carta Laboral"
                   />
                  
                  ))}

                  {documentos.map((documento) =>(
                    <Image
                       key={documento.referenciaFamilia}
                       width={100}
                       src={`http://localhost:8080/referencia-familiar/${documento.referenciaFamilia}`}
                      alt="Carta Laboral"
                   />
                  
                  ))}

                  {documentos.map((documento) =>(
                    <Image
                       key={documento.referencia_laboral}
                       width={100}
                       src={`http://localhost:8080/referencia-laboral/${documento.referencia_laboral}`}
                      alt="Carta Laboral"
                   />
                  
                  ))}

                  {documentos.map((documento) => (
                     <Image 
                        key={documento.servicios}
                        src={`http://localhost:8080/referencia-laboral/${documento.referencia_laboral}`}
                        width={100}
                        alt='Servicios'
                      />
                  ))}

                  {documentos.map((documento) => (
                     <div>

                       {documento.desembolso != null ? (
                         <Image
                         key={documento.desembolso}
                         width={100}
                         src={`http://localhost:8080/desembolso/${documento.desembolso}`}
                         alt='Desembolso'
                        />
                       ): (
                         <div></div>
                       )}

                     </div>
                    
                  ))}
                </div>

                
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </MainLayout>
  );
};