import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';

export const VistaSolicitudesPendientes = () => {
    const [solicitudesPendientes, setsolicitudesPendientes] = useState([]);

    useEffect(() => {
        const solicitudesGuardadas = localStorage.getItem('solicitudesPendientes');
        if (solicitudesGuardadas) {
            setsolicitudesPendientes(JSON.parse(solicitudesGuardadas));
            console.log(solicitudesGuardadas);
        }
    }, []);

    const eliminarSolicitud = (index) => {
        const nuevasSolicitudes = [...solicitudesPendientes];
        nuevasSolicitudes.splice(index, 1);
        setsolicitudesPendientes(nuevasSolicitudes);
        localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
    };

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '260px', marginTop: '5px'}}>
                {solicitudesPendientes.map((solicitud, index) => (
                    <div key={index} style={{ margin: 0 }}>
                        <Card title={`Solicitud #${index + 1}`} style={{ width: 200 }}>
                            <Link to={`/cliente/${solicitud.cliente}`}>
                                <p><strong>Cliente:</strong> {solicitud.cliente}</p>
                                <p><strong>Monto:</strong> {solicitud.monto}</p>
                            </Link>
                            <Button type="primary" onClick={() => eliminarSolicitud(index)}>Eliminar</Button>
                        </Card>
                    </div>
                ))}
            </div>
        </>
    );
};

export const SolicitudesPendientes = () => {
    return (
        <VistaSolicitudesPendientes />
    );
};

