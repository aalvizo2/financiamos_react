import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Modal } from 'antd';
import MainLayout from './MainLayout';

const { Meta } = Card;

export const VistaPrevia = () => {
  const [datos, setDatos] = useState({});
  const [datosLaborales, setDatosLaborales] = useState({});
  const [cedula, setCedula] = useState('');
  const [cartaLaboral, setCartaLaboral] = useState('');
  const [visible, setVisible] = useState(false);
  const [imagenGrande, setImagenGrande] = useState('');
  const [referencias, setReferencias] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('datos');
    if (data) {
      setDatos(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const referencias = localStorage.getItem('referencias');
    if (referencias) {
      try {
        const parsedReferencias = JSON.parse(referencias);
        if (Array.isArray(parsedReferencias.referencias)) {
          setReferencias(parsedReferencias.referencias);
        } else {
          console.error("Referencias data is not valid");
          setReferencias([]);
        }
      } catch (error) {
        console.error("Error parsing referencias from localStorage", error);
        setReferencias([]);
      }
    }
  }, []);

  useEffect(() => {
    const datosLaborales = localStorage.getItem('datosLaborales');
    if (datosLaborales) {
      setDatosLaborales(JSON.parse(datosLaborales));
    }
  }, []);

  useEffect(() => {
    const cedula = localStorage.getItem('cedula');
    if (cedula) {
      setCedula(cedula);
    }
  }, []);

  useEffect(() => {
    const cartaLaboral = localStorage.getItem('cartaLaboral');
    if (cartaLaboral) {
      setCartaLaboral(cartaLaboral);
    }
  }, []);

  const handlePreview = (imagen) => {
    setImagenGrande(imagen);
    setVisible(true);
  };

  return (
    <MainLayout>
      <div className='contenedor'>
        <h2 style={{ textAlign: 'center' }}>Vista Previa</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Identificación'
              cover={<img src={`http://localhost:8080/cedula/${cedula}`} alt='Identificación' className='image' onClick={() => handlePreview(`http://localhost:8080/cedula/${cedula}`)} style={{ padding: 5 }} />}
            >
              <Meta title='Datos Personales' description={
                <>
                  <p><span>Nombre:</span> {datos.nombre}</p>
                  <p><span>Dirección:</span> {datos.direccion}</p>
                  <p><span>Télefono:</span> {datos.telefono}</p>
                  <p><span>Barrio:</span> {datos.colonia}</p>
                </>
              } />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Carta Laboral'
              cover={<img src={`http://localhost:8080/carta-laboral/${cartaLaboral}`} alt='Carta Laboral' className='image' onClick={() => handlePreview(`http://localhost:8080/carta-laboral/${cartaLaboral}`)} style={{ padding: 5 }} />}
            >
              <Meta title='Datos Laborales' description={
                <>
                  <p><span>Puesto:</span> {datosLaborales.puesto}</p>
                  <p><span>Empresa:</span> {datosLaborales.empresa}</p>
                  <p><span>Antigüedad:</span> {datosLaborales.antiguedad}</p>
                  <p><span>Sueldo Inicial:</span> {datosLaborales.sueldo_in}</p>
                  <p><span>Sueldo Final:</span> {datosLaborales.sueldo_final}</p>
                </>
              } />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card className='card' title='Referencias'>
              {referencias.length > 0 ? referencias.map((referencia, index) => (
                <Card key={index} title={`Referencia ${index + 1}`}>
                  <p><span>Nombre:</span> {referencia.referencia}</p>
                  <p><span>Domicilio:</span> {referencia.referencia_dom}</p>
                  <p><span>Número de Célular:</span> {referencia.referencia_cel}</p>
                </Card>
              )) : <p>No hay referencias disponibles</p>}
            </Card>
          </Col>
        </Row>
        <Modal visible={visible} onCancel={() => setVisible(false)} footer={null} centered>
          <img src={imagenGrande} alt='Imagen en grande' style={{ width: '100%' }} />
        </Modal>
      </div>
    </MainLayout>
  );
};
