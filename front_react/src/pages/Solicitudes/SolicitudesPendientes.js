import React, { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { Link} from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../../components/MainLayout';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../../route';

export const VistaSolicitudesPendientes = () => {
    
    const navigate= useNavigate();
    const [solicitud, setSolicitud]= useState([]);
    


    const getSolicitudes= async() => {
        const response= await axios.get(`${RUTA}/getSolicitud`); 
        setSolicitud(response.data.Data);
    }; 

    useEffect(() => {
        getSolicitudes();
    }, []);
    /*useEffect(() => {
        const solicitudesGuardadas = localStorage.getItem('solicitudesPendientes');
        if (solicitudesGuardadas) {
            setSolicitudesPendientes(JSON.parse(solicitudesGuardadas));
            console.log(solicitudesGuardadas);
        }
    }, []);*/

    /*const eliminarSolicitud = (index) => {
        const nuevasSolicitudes = [...solicitudesPendientes];
        nuevasSolicitudes.splice(index, 1);
        setSolicitudesPendientes(nuevasSolicitudes);
        localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
    };¨*/

    const eliminarSolicitud= async(id) => { 
        console.log(id);

        const response= await axios.delete(`${RUTA}/eliminarSolicitud/${id}`);
        if(response.status === 204){
            message.success('Operación realizada con éxito');
        }else{
            message.error('Error al eliminar solicitud');
        };

        getSolicitudes();
    }

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
            
                {solicitud.map((solicitud, index) => (
                    <div key={index} style={{ margin: 0 }}>
                        <Card title={`Solicitud #${index + 1}`} style={{ width: 200 }}>
                            <Link 
                                to={`/cliente/${solicitud.nombre}`}
                                onClick={(event) => handleLinkClick(solicitud.nombre, solicitud.monto, event)}
                            >
                                <p><strong>Cliente:</strong> {solicitud.nombre}</p>
                                <p><strong>Monto:</strong> {solicitud.monto}</p>
                            </Link>
                            <Button type="primary" onClick={() => eliminarSolicitud(solicitud.Id)}>Eliminar</Button>
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
