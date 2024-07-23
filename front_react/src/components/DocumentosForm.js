import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Button, Form, Card, Image, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MainLayout from './MainLayout';

const FileUploadForm = () => {
  const [files, setFiles] = useState({
    cedula: null,
    cartaLaboral: null,
    formatoReferencias: null,
    pagare: null,
    referenciaFamiliar: null,
    referenciaLaboral: null,
  });
  
  const [previews, setPreviews] = useState({
    cedula: null,
    cartaLaboral: null,
    formatoReferencias: null,
    pagare: null,
    referenciaFamiliar: null,
    referenciaLaboral: null,
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
    const {
      cedula,
      cartaLaboral,
      formatoReferencias,
      pagare,
      referenciaFamiliar,
      referenciaLaboral,
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

    try {
      await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Documentos subidos exitosamente');
      window.location.href = '/vista_previa';
    } catch (error) {
      console.error('Error al subir los documentos:', error);
      message.error('Error al subir los documentos');
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
                  </Upload>
                  {previews[key] && (
                    <Image
                      width={200}
                      src={previews[key]}
                      alt={`Preview ${key}`}
                      style={{ marginTop: '10px' }}
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </MainLayout>
  );
};

export default FileUploadForm;
