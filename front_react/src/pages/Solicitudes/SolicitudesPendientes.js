import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { Link} from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../../components/MainLayout';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../../route';

export const VistaSolicitudesPendientes = () => {
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const navigate= useNavigate();
    

    useEffect(() => {
        const solicitudesGuardadas = localStorage.getItem('solicitudesPendientes');
        if (solicitudesGuardadas) {
            setSolicitudesPendientes(JSON.parse(solicitudesGuardadas));
            console.log(solicitudesGuardadas);
        }
    }, []);

    const eliminarSolicitud = (index) => {
        const nuevasSolicitudes = [...solicitudesPendientes];
        nuevasSolicitudes.splice(index, 1);
        setSolicitudesPendientes(nuevasSolicitudes);
        localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
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
        <>
            
                {solicitudesPendientes.map((solicitud, index) => (
                    <div key={index} style={{ margin: 0 }}>
                        <Card title={`Solicitud #${index + 1}`} style={{ width: 200 }}>
                            <Link 
                                to={`/cliente/${solicitud.cliente}`}
                                onClick={(event) => handleLinkClick(solicitud.cliente, solicitud.monto, event)}
                            >
                                <p><strong>Cliente:</strong> {solicitud.cliente}</p>
                                <p><strong>Monto:</strong> {solicitud.monto}</p>
                            </Link>
                            <Button type="primary" onClick={() => eliminarSolicitud(index)}>Eliminar</Button>
                        </Card>
                    </div>
                ))}
           
        </>
    );
};

export const SolicitudesPendientes = () => {
    return (
        <MainLayout>
            <VistaSolicitudesPendientes />
        </MainLayout>
    );
};
