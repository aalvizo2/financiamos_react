import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import './css/vista_previacredito.css'


export const VistaPreviaPrestamoDatos = () => {
    const [usuario, setUsuario] = useState('');
    const [plazo, setPlazo] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [abono, setAbono]= useState('')

    useEffect(() => {
        const jalarUsuario = async () => {
            const cliente = localStorage.getItem('nombre_persona');
            setUsuario(cliente);
        };
        jalarUsuario();
    }, []);

    const jalarDatosCredito = async () => {
        try {
            const cliente= localStorage.getItem('nombre_persona')
            const response = await axios.get(`http://localhost:8080/datos_prestamo?nombre=${encodeURIComponent(cliente)}`);
            setPlazo(response.data.datos)
            setAbono(response.data.montoTotal)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los datos',
                showCancelButton: true
            });
        }
    };

    useEffect(() => {
        jalarDatosCredito();
    }, []); // Llamar a jalarDatosCredito solo una vez al montar el componente

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
        </div>
    );
};