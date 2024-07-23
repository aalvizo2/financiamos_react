import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Modal } from 'antd';
import MainLayout from './MainLayout';

const { Meta } = Card;

export const VistaPrevia = () => {
  const [datos, setDatos] = useState({});
  const [datosLaborales, setDatosLaborales] = useState({});
  const [cedula, setCedula] = useState('');
  const [cartaLaboral, setCartaLaboral] = useState('');
  const [referenciaFamiliar, setReferenciaFamiliar] = useState('');
  const [referenciaLaboral, setReferenciaLaboral] = useState('');
  const [formatoReferencias, setFormatoReferencias] = useState('');
  const [paga, setPaga] = useState('');
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
    setReferenciaFamiliar(localStorage.getItem('referenciaFamiliar') || '');
    setReferenciaLaboral(localStorage.getItem('referenciaLaboral') || '');
    setFormatoReferencias(localStorage.getItem('formatoReferencias') || '');
    setPaga(localStorage.getItem('pagare') || '');
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
          {/*<Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Referencia Familiar'
              cover={<img src={`http://localhost:8080/referencia-familiar/${referenciaFamiliar}`} alt='Referencia Familiar' className='image' onClick={() => handlePreview(`http://localhost:8080/referencia-familiar/${referenciaFamiliar}`)} style={{ padding: 5 }} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Referencia Laboral'
              cover={<img src={`http://localhost:8080/referencia-laboral/${referenciaLaboral}`} alt='Referencia Laboral' className='image' onClick={() => handlePreview(`http://localhost:8080/referencia-laboral/${referenciaLaboral}`)} style={{ padding: 5 }} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Formato Referencias'
              cover={<img src={`http://localhost:8080/formato-referencias/${formatoReferencias}`} alt='Formato Referencias' className='image' onClick={() => handlePreview(`http://localhost:8080/formato-referencias/${formatoReferencias}`)} style={{ padding: 5 }} />}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              className='card'
              title='Pagaré'
              cover={<img src={`http://localhost:8080/pagare/${paga}`} alt='Pagaré' className='image' onClick={() => handlePreview(`http://localhost:8080/pagare/${paga}`)} style={{ padding: 5 }} />}
            />
          </Col>*/}
        </Row>
        <Modal visible={visible} onCancel={() => setVisible(false)} footer={null} centered>
          <img src={imagenGrande} alt='Imagen en grande' style={{ width: '100%' }} />
        </Modal>
      </div>
    </MainLayout>
  );
};
