import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Button, Form, Card, Image, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MainLayout from './MainLayout';
import { useNavigate } from 'react-router-dom';
import { RUTA  } from '../route';


const FileUploadForm = () => {
  const [files, setFiles] = useState({
    cedula: null,
    cartaLaboral: null,
    formatoReferencias: null,
    pagare: null,
    referenciaFamiliar: null,
    referenciaLaboral: null,
    servicios: null
  });
  const navigate= useNavigate();
  const [loading, setLoading]= useState(false);
  
  const [previews, setPreviews] = useState({
    cedula: null,
    cartaLaboral: null,
    formatoReferencias: null,
    pagare: null,
    referenciaFamiliar: null,
    referenciaLaboral: null,
    servicios: null
  });

  const handleFileChange = (type) => (info) => {
    const file = info.file.originFileObj;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFiles((prevFiles) => ({ ...prevFiles, [type]: file }));
        localStorage.setItem(type, file.name);
        setPreviews((prevPreviews) => ({ ...prevPreviews, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      console.error(`Error al cargar el archivo de la ${type}`);
      message.error(`Error al cargar el archivo de la ${type}`);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const {
      cedula,
      cartaLaboral,
      formatoReferencias,
      pagare,
      referenciaFamiliar,
      referenciaLaboral,
      servicios
    } = files;

    if (!cedula || !cartaLaboral || !formatoReferencias || !pagare || !referenciaFamiliar || !referenciaLaboral) {
      console.error('Por favor suba todos los documentos.');
      message.error('Por favor suba todos los documentos.');
      return;
    }

    const formData = new FormData();
    formData.append('cedula', cedula);
    formData.append('cartaLaboral', cartaLaboral);
    formData.append('formatoReferencias', formatoReferencias);
    formData.append('pagare', pagare);
    formData.append('referenciaFamiliar', referenciaFamiliar);
    formData.append('referenciaLaboral', referenciaLaboral);
    formData.append('servicios', servicios);
    try {
      await axios.post(`${RUTA}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      

      message.success('Documentos subidos exitosamente');
      navigate('/vista_previa');
    } catch (error) {
      console.error('Error al subir los documentos:', error);
      message.error('Error al subir los documentos');
    }finally{
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Documentos:</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Card title="Subir Documentos" bordered={false} style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Row gutter={16}>
            {Object.keys(previews).map((key) => (
              <Col xs={24} md={12} key={key}>
                <Form.Item label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}>
                  <Upload
                    onChange={handleFileChange(key)}
                    accept="*/*"
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Subir {key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Button>
                  </Upload><br />
                  {previews[key] && (
                    <Image
                      width={100}
                      src={previews[key]}
                      alt={`Preview ${key}`}
                      style={{ marginTop: '20px' }}
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Enviar
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </MainLayout>
  );
};

export default FileUploadForm;
