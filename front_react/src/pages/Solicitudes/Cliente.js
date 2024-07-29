import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { Button, Select, Form, Input, Row, Col } from 'antd';
import Swal from 'sweetalert2';

const { Option } = Select;

const Cliente = () => {
  const { cliente } = useParams();
  const [datos, setDatos] = useState(null);
  const [estatus, setEstatus] = useState('');

  useEffect(() => {
    console.log("Cliente ID:", cliente);
    axios.get(`http://localhost:8080/datosCliente/${cliente}`)
      .then(response => {
        if (response.status === 200) {
          console.log("Datos del cliente:", response.data);
          setDatos(response.data);
        } else {
          console.error("Error al obtener los datos del cliente:", response.statusText);
        }
      })
      .catch(error => {
        console.error("Error en la solicitud:", error);
      });
  }, [cliente]);

  const handleSelectChange = (value) => {
    setEstatus(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datosActualizados = {
      estatus,
      nombre: datos[0]?.nombre,
      monto: datos[0]?.monto,
      fechaInicio: datos[0]?.fechaInicio,
      frecuenciaPago: datos[0]?.frecuenciaPago
    };

    axios.put(`http://localhost:8080/actualizarEstatus/${cliente}`, datosActualizados)
      .then(response => {
        console.log("Estado actualizado:", response.data);
        Swal.fire({
          title: 'Usuario Aprobado con éxito',
          icon: 'success',
          showConfirmButton: true,
          monto: datos[0]?.monto
        }).then((result) => {
          const solicitudesPendientes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
          const nuevasSolicitudes = solicitudesPendientes.filter(solicitud => solicitud.cliente !== cliente);
          localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
          window.location.href = '/inicio';
        });

        if (datosActualizados.estatus === 'Rechazado') {
          const solicitudesPendientes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
          const nuevasSolicitudes = solicitudesPendientes.filter(solicitud => solicitud.cliente !== cliente);
          localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
          window.location.href = '/clientes';
        }
      })
      .catch(error => {
        console.error("Error al actualizar el estado:", error);
      });
  };

  if (!datos) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <MainLayout>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {datos.map((dato) => (
            <Form key={dato.nombre} layout="vertical" style={{ width: '100%', marginBottom: '20px' }}>
              <Row gutter={16}>
                <Col span={4}>
                  <img src={`http://localhost:8080/cedula/${dato.cedula}`} alt='Identificación' style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
                  <img src={`http://localhost:8080/carta-laboral/${dato.carta_laboral}`} alt='Carta Laboral' style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
                </Col>
                <Col span={10}>
                  <Form.Item label="Nombre">
                    <Input value={dato.nombre} disabled />
                  </Form.Item>
                  <Form.Item label="Dirección">
                    <Input value={dato.direccion} disabled />
                  </Form.Item>
                  <Form.Item label="Teléfono">
                    <Input value={dato.telefono} disabled />
                  </Form.Item>
                  <Form.Item label="Cumpleaños">
                    <Input value={dato.cumple} disabled />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Puesto">
                    <Input value={dato.puesto} disabled />
                  </Form.Item>
                  <Form.Item label="Empresa">
                    <Input value={dato.empresa} disabled />
                  </Form.Item>
                  <Form.Item label="Antigüedad">
                    <Input value={dato.antiguedad} disabled />
                  </Form.Item>
                  <Form.Item label="Sueldo Inicial">
                    <Input value={dato.sueldo_in} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Sueldo Final">
                    <Input value={dato.sueldo_final} disabled />
                  </Form.Item>
                  <Form.Item label="Monto">
                    <Input value={dato.monto} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
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
          <Select value={estatus} onChange={handleSelectChange} style={{ width: 200 }}>
            <Option value="">Seleccionar estatus</Option>
            <Option value="Aprobado">Aprobado</Option>
            <Option value="Rechazado">Rechazado</Option>
          </Select>
          <Button type="primary" htmlType="submit" style={{ marginLeft: '10px' }}>Actualizar estado</Button>
        </form>
      </MainLayout>
    </>
  );
};

export default Cliente;
