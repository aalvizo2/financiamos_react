import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { Button, Select, Form, Input, Row, Col, Image, notification } from 'antd';
import { RUTA } from '../../route';
import ClipLoader from "react-spinners/ClipLoader";

const { Option } = Select;

const Cliente = () => {
  const { cliente } = useParams();
  const [datos, setDatos] = useState(null);
  const [estatus, setEstatus] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${RUTA}/datosCliente/${cliente}`)
      .then(response => {
        if (response.status === 200) {
          setDatos(response.data);
        } else {
          console.error("Error al obtener los datos del cliente:", response.statusText);
        }
      })
      .catch(error => {
        console.error("Error en la solicitud:", error);
      })
      .finally(() => {
        setLoading(false); // Detener el loading una vez que la solicitud finaliza
      });
  }, [cliente]);

  const handleSelectChange = (value) => {
    setEstatus(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!estatus) {
      notification.warning({
        message: 'Estatus requerido',
        description: 'Por favor seleccione un estatus antes de continuar.',
      });
      return;
    }

    const datosActualizados = {
      estatus,
      nombre: datos[0]?.nombre,
      monto: datos[0]?.monto,
      fechaInicio: datos[0]?.fechaInicio,
      frecuenciaPago: datos[0]?.frecuenciaPago,
    };

    axios.put(`${RUTA}/actualizarEstatus/${cliente}`, datosActualizados)
      .then(response => {
        const solicitudesPendientes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
        const nuevasSolicitudes = solicitudesPendientes.filter(solicitud => solicitud.cliente !== cliente);
        localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));

        if (datosActualizados.estatus === 'Aprobado') {
          notification.success({
            message: 'Usuario aprobado con éxito',
          });
          navigate('/clientes');
        } else if (datosActualizados.estatus === 'Rechazado') {
          notification.error({
            message: 'Usuario no aprobado',
          });
          navigate('/clientes');
        }
      })
      .catch(error => {
        console.error("Error al actualizar el estado:", error);
        notification.error({
          message: 'Error al actualizar el estado',
          description: 'Hubo un problema al intentar actualizar el estado del cliente.',
        });
      });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color='#000' loading={loading} size={50} />
      </div>
    );
  }

  return (
    <MainLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {datos.map((dato) => (
          <Form key={dato.nombre} layout="vertical" style={{ width: '100%', marginBottom: '20px' }}>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={8} md={6} lg={4}>
                <Image
                  src={`${RUTA}/cedula/${dato.cedula}`}
                  alt='Identificación'
                  style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
                />
                <Image
                  src={`${RUTA}/carta-laboral/${dato.carta_laboral}`}
                  alt='Carta Laboral'
                  style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
                />
              </Col>
              <Col xs={24} sm={16} md={10} lg={10}>
                <Form.Item label="Nombre">
                  <Input value={dato.nombre} disabled />
                </Form.Item>
                <Form.Item label="Dirección">
                  <Input value={dato.direccion} disabled />
                </Form.Item>
                <Form.Item label="Teléfono">
                  <Input value={dato.telefono} disabled />
                </Form.Item>
                <Form.Item label="Sueldo Inicial">
                  <Input value={dato.sueldo_in} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16} md={8} lg={10}>
                <Form.Item label="Puesto">
                  <Input value={dato.puesto} disabled />
                </Form.Item>
                <Form.Item label="Empresa">
                  <Input value={dato.empresa} disabled />
                </Form.Item>
                <Form.Item label="Antigüedad">
                  <Input value={dato.antiguedad} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Sueldo Final">
                  <Input value={dato.sueldo_final} disabled />
                </Form.Item>
                <Form.Item label="Monto">
                  <Input value={dato.monto} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Fecha de Inicio">
                  <Input value={dato.fechaInicio} disabled />
                </Form.Item>
                <Form.Item label="Frecuencia de Pago">
                  <Input value={dato.frecuenciaPago} disabled />
                </Form.Item>
                <Form.Item label="Plazo">
                  <Input value={dato.plazo} disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', textAlign: 'center' }}>
        <Select
          value={estatus}
          onChange={handleSelectChange}
          style={{ width: '100%', maxWidth: '200px' }}
        >
          <Option value="">Seleccionar estatus</Option>
          <Option value="Aprobado">Aprobado</Option>
          <Option value="Rechazado">Rechazado</Option>
        </Select>
        <Button type="primary" htmlType="submit" style={{ marginLeft: '10px', marginTop: '10px' }}>
          Actualizar estado
        </Button>
      </form>
    </MainLayout>
  );
};

export default Cliente;
