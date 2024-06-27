import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Button, Form, Card, Image, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import MainLayout from './MainLayout';

const FileUploadForm = () => {
  const [files, setFiles] = useState({ cedula: null, cartaLaboral: null });
  const [previews, setPreviews] = useState({ cedula: null, cartaLaboral: null });

  const handleFileChange = (type) => (info) => {
    const file = info.file.originFileObj;
    

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        
        setFiles((prevFiles) => ({ ...prevFiles, [type]: file }));

        // Guardar el nombre del archivo en localStorage
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
    if (!files.cedula || !files.cartaLaboral) {
      console.error('Por favor suba ambos documentos.');
      message.error('Por favor suba ambos documentos.');
      return;
    }

    const formData = new FormData();
    formData.append('cedula', files.cedula);
    formData.append('cartaLaboral', files.cartaLaboral);

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
            <Col xs={24} md={12}>
              <Form.Item label="Cédula">
                <Upload
                  onChange={handleFileChange('cedula')}
                  accept="*/*"
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Subir Cédula</Button>
                </Upload>
                {previews.cedula && (
                  <Image
                    width={200}
                    src={previews.cedula}
                    alt="Preview Cédula"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Carta Laboral">
                <Upload
                  onChange={handleFileChange('cartaLaboral')}
                  accept="*/*"
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Subir Carta Laboral</Button>
                </Upload>
                {previews.cartaLaboral && (
                  <Image
                    width={200}
                    src={previews.cartaLaboral}
                    alt="Preview Carta Laboral"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </Form.Item>
            </Col>
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

