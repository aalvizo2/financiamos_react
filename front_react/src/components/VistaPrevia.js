import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Modal } from 'antd';
import MainLayout from './MainLayout';
import { RUTA } from '../route';


const { Meta } = Card;

export const VistaPrevia = () => {
  const [datos, setDatos] = useState({});
  const [datosLaborales, setDatosLaborales] = useState({});
  const [cedula, setCedula] = useState('');
  const [cartaLaboral, setCartaLaboral] = useState('');
  const [visible, setVisible] = useState(false);
  const [imagenGrande, setImagenGrande] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('datos');
    if (data) {
      setDatos(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const datosLaborales = localStorage.getItem('datosLaborales');
    if (datosLaborales) {
      setDatosLaborales(JSON.parse(datosLaborales));
    }
  }, []);

  useEffect(() => {
    setCedula(localStorage.getItem('cedula') || '');
    setCartaLaboral(localStorage.getItem('cartaLaboral') || '');
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
              cover={
                <img
                  src={`${RUTA}/cedula/${cedula}`}
                  alt='Identificación'
                  className='image'
                  onClick={() => handlePreview(`${RUTA}/cedula/${cedula}`)}
                  style={{ padding: 5 }}
                />
              }
            >
              <Meta
                title='Datos Personales'
                description={
                  <>
                    <p><span>Nombre:</span> {datos.nombre}</p>
                    <p><span>Dirección:</span> {datos.direccion}</p>
                    <p><span>Télefono:</span> {datos.telefono}</p>
                    <p><span>Barrio:</span> {datos.colonia}</p>
                  </>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Carta Laboral'
              cover={
                <img
                  src={`${RUTA}/carta-laboral/${cartaLaboral}`}
                  alt='Carta Laboral'
                  className='image'
                  onClick={() => handlePreview(`${RUTA}/carta-laboral/${cartaLaboral}`)}
                  style={{ padding: 5 }}
                />
              }
            >
              <Meta
                title='Datos Laborales'
                description={
                  <>
                    <p><span>Puesto:</span> {datosLaborales.puesto}</p>
                    <p><span>Empresa:</span> {datosLaborales.empresa}</p>
                    <p><span>Antigüedad:</span> {datosLaborales.antiguedad}</p>
                    <p><span>Sueldo Inicial:</span> {datosLaborales.sueldo_in}</p>
                    <p><span>Sueldo Final:</span> {datosLaborales.sueldo_final}</p>
                  </>
                }
              />
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
