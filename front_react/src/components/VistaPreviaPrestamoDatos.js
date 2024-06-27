import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Typography, Layout, Form, Input, Button } from 'antd';
import MainLayout from './MainLayout';
import './css/vista_previacredito.css';

const { Title } = Typography;

export const VistaPreviaPrestamoDatos = () => {
  const [usuario, setUsuario] = useState('');
  const [plazo, setPlazo] = useState([]);
  const [abono, setAbono] = useState('');
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [pagoMinimo, setPagoMinimo] = useState('');

  useEffect(() => {
    const cliente = localStorage.getItem('nombre_persona');
    if (cliente) {
      setUsuario(cliente);
      setUsuarioRegistrado(true);
    }
  }, []);

  const jalarDatosCredito = async () => {
    try {
      const cliente = localStorage.getItem('nombre_persona');
      const response = await axios.get(`http://localhost:8080/datos_prestamo?nombre=${encodeURIComponent(cliente)}`);
      const datos = response.data.datos;
      const montoTotal = Math.ceil(response.data.montoTotal);
      const pagoMinimo = Math.ceil(response.data.pagoMinimo);

      const updatedDatos = datos.map(dato => ({
        ...dato,
        montoTotal,
        pagoMinimo
      }));

     

      setPlazo(updatedDatos);
      setAbono(montoTotal);
      setPagoMinimo(pagoMinimo);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar los datos',
        text: 'Hubo un problema al cargar los datos del préstamo. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleSubmit = async (values) => {
    const nuevaSolicitud = {
      cliente: usuario,
      monto: abono,
      fechaInicio: plazo.length > 0 ? plazo[0].fechaInicio : '',
      frecuenciaPago: plazo.length > 0 ? plazo[0].frecuenciaPago : '',
      plazo: plazo.length > 0 ? plazo[0].plazo : '',
      abono: abono,
      pagoMinimo: pagoMinimo
    };
    const nuevasSolicitudesPendientes = [...solicitudesPendientes, nuevaSolicitud];
    setSolicitudesPendientes(nuevasSolicitudesPendientes);
    localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudesPendientes));
    Swal.fire({
      title: 'Solicitud guardada en espera de aprobación',
      icon: 'success',
    });
  };

  useEffect(() => {
    const solicitudesGuardadas = localStorage.getItem('solicitudesPendientes');
    if (solicitudesGuardadas) {
      setSolicitudesPendientes(JSON.parse(solicitudesGuardadas));
    }
    jalarDatosCredito();
  }, []);

  return (
    <MainLayout>
      <Layout.Content className="container">
        <Title level={2}>{usuario}</Title>
        
        <div>
          {plazo.length > 0 ? (
            plazo.map((dato, index) => (
              <div key={index} className="datos-prestamo">
                <p>
                  <span>Monto Entregado:</span> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(dato.montoTotal)}
                </p>
                <p>
                  <span>Fecha de inicio:</span> {dato.fechaInicio}
                </p>
                <p>
                  <span>Frecuencia de pago:</span> {dato.frecuenciaPago}
                </p>
                <p>
                  <span>Plazo:</span> {dato.plazo}
                </p>
                <p>
                  <span>Pago Mínimo:</span> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(pagoMinimo)}
                </p>
              </div>
            ))
          ) : (
            <div>No hay datos para mostrar</div>
          )}
        </div>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nombre" name="nombre" initialValue={usuario} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Monto" name="monto" initialValue={abono} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha de Inicio"
            name="fechaInicio"
            initialValue={plazo.length > 0 ? plazo[0].fechaInicio : ''}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Frecuencia de Pago"
            name="frecuenciaPago"
            initialValue={plazo.length > 0 ? plazo[0].frecuenciaPago : ''}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item label="Plazo" name="plazo" initialValue={plazo.length > 0 ? plazo[0].plazo : ''} hidden>
            <Input />
          </Form.Item>
          <Form.Item label="Abono" name="abono" initialValue={abono} hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Generar
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </MainLayout>
  );
};
