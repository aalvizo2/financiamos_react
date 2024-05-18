import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/vista_previacredito.css';

export const VistaPreviaPrestamoDatos = () => {
    const [usuario, setUsuario] = useState('');
    const [plazo, setPlazo] = useState([]);
    const [abono, setAbono] = useState('');
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);

    useEffect(() => {
        const beforeUnload = (event) => {
            const cliente = localStorage.getItem('nombre_persona');
            localStorage.setItem('nombre_persona', cliente);
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);

    useEffect(() => {
        const jalarUsuario = async () => {
            const cliente = localStorage.getItem('nombre_persona');
            setUsuario(cliente);
        };
        jalarUsuario();
    }, []);

    const jalarDatosCredito = async () => {
        try {
            const cliente = localStorage.getItem('nombre_persona');
            const response = await axios.get(`http://localhost:8080/datos_prestamo?nombre=${encodeURIComponent(cliente)}`);
            setPlazo(response.data.datos);
            setAbono(response.data.montoTotal);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los datos',
                showCancelButton: true,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const nuevaSolicitud = {
            cliente: formData.get('nombre'),
            monto: formData.get('monto'),
            fechaInicio: formData.get('fechaInicio'),
            frecuenciaPago: formData.get('frecuenciaPago'),
            plazo: formData.get('plazo'),
            abono: formData.get('abono')
        };
        const nuevasSolicitudesPendientes = [...solicitudesPendientes, nuevaSolicitud];
        setSolicitudesPendientes(nuevasSolicitudesPendientes);
        localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudesPendientes));
        console.log(solicitudesPendientes, nuevaSolicitud)
        Swal.fire({
            title: 'Solicitud guardada en espera de aprobación',
            icon: 'success'
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
        <div className='container'>
            <h1>{usuario}</h1>
            <div>
                {plazo.length > 0 ? (
                    plazo.map((dato, index) => (
                        <div key={index}>
                            <p><span>Monto:</span> ${dato.monto.toLocaleString('es-MX')}.00</p>
                            <p><span>Fecha de inicio:</span> {dato.fechaInicio}</p>
                            <p><span>Frecuencia de pago:</span> {dato.frecuenciaPago}</p>
                            <p><span>Plazo:</span> {dato.plazo}</p>
                            <p><span>Abono:</span> ${abono}.00</p>
                        </div>
                    ))
                ) : (
                    <div>No hay datos para mostrar</div>
                )}
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type='hidden' name='nombre' value={usuario} />
                    <input type='hidden' name='monto' value={plazo.length > 0 ? plazo[0].monto : ''} />
                    <input type='hidden' name='fechaInicio' value={plazo.length > 0 ? plazo[0].fechaInicio : ''} />
                    <input type='hidden' name='frecuenciaPago' value={plazo.length > 0 ? plazo[0].frecuenciaPago : ''} />
                    <input type='hidden' name='plazo' value={plazo.length > 0 ? plazo[0].plazo : ''} />
                    <input type='hidden' name='abono' value={abono} />
                    <input type='submit' value='Generar' />
                </form>
            </div>
          
        </div>
    );
};
