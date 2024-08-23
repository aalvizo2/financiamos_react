import React, { useEffect, useState } from 'react';
import { Card, Button, message, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../../components/MainLayout';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../../route';

export const VistaSolicitudesPendientes = () => {
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);

    const getSolicitudes = async () => {
        try {
            const response = await axios.get(`${RUTA}/getSolicitud`);
            setSolicitudes(response.data.Data);
        } catch (error) {
            console.error('Error fetching solicitudes:', error);
        }
    };

    useEffect(() => {
        getSolicitudes();
    }, []);

    const eliminarSolicitud = async (id) => {
        try {
            const response = await axios.delete(`${RUTA}/eliminarSolicitud/${id}`);
            if (response.status === 204) {
                message.success('Operación realizada con éxito');
                getSolicitudes();
            } else {
                message.error('Error al eliminar solicitud');
            }
        } catch (error) {
            message.error('Error al eliminar solicitud');
        }
    };

    const actualizarMonto = async (cliente, monto) => {
        try {
            await axios.put(`${RUTA}/actualizarMonto`, { cliente, monto });
            console.log('Monto actualizado exitosamente');
        } catch (error) {
            console.error('Error actualizando monto:', error);
        }
    };

    const handleLinkClick = async (cliente, monto, event) => {
        event.preventDefault(); // Prevenir la navegación por defecto
        await actualizarMonto(cliente, monto);
        navigate(`/cliente/${cliente}`);
    };

    return (
        <Row gutter={16}>
            {solicitudes.map((solicitud, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card title={`Solicitud #${index + 1}`} style={{ marginBottom: 16, width: 200 }}>
                        <Link 
                            to={`/cliente/${solicitud.nombre}`}
                            onClick={(event) => handleLinkClick(solicitud.nombre, solicitud.monto, event)}
                        >
                            <p><strong>Cliente:</strong> {solicitud.nombre}</p>
                            <p><strong>Monto:</strong> {solicitud.monto}</p>
                        </Link>
                        <Button type="primary" onClick={() => eliminarSolicitud(solicitud.Id)}>
                            Eliminar
                        </Button>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export const SolicitudesPendientes = () => {
    return (
        <MainLayout>
            <VistaSolicitudesPendientes />
        </MainLayout>
    );
};
