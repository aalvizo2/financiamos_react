import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { Button, Select } from 'antd';
import Swal from 'sweetalert2';

const { Option } = Select;

const Cliente = () => {
    const { cliente } = useParams();
    const [datos, setDatos] = useState(null);  // Inicializa con null en lugar de []
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
                    showConfirmButton: true
                }).then((result) => {
                    // Obtener las solicitudes pendientes del localStorage
                    const solicitudesPendientes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
                    // Filtrar las solicitudes para eliminar la del cliente actual
                    const nuevasSolicitudes = solicitudesPendientes.filter(solicitud => solicitud.cliente !== cliente);
                    // Guardar las solicitudes actualizadas en el localStorage
                    localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
                    window.location.href = '/inicio';
                });

                if (datosActualizados.estatus === 'Rechazado') {
                    // Obtener las solicitudes pendientes del localStorage
                    const solicitudesPendientes = JSON.parse(localStorage.getItem('solicitudesPendientes')) || [];
                    // Filtrar las solicitudes para eliminar la del cliente actual
                    const nuevasSolicitudes = solicitudesPendientes.filter(solicitud => solicitud.cliente !== cliente);
                    // Guardar las solicitudes actualizadas en el localStorage
                    localStorage.setItem('solicitudesPendientes', JSON.stringify(nuevasSolicitudes));
                    window.location.href = '/clientes';
                }
            })
            .catch(error => {
                console.error("Error al actualizar el estado:", error);
            });
    };

    if (!datos) {
        return <div>Cargando...</div>;  // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <>  
          <MainLayout>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {datos.map((dato) => (
                    <div key={dato.nombre} style={{ width: '300px', margin: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
                        <img src={`http://localhost:8080/cedula/${dato.cedula}`} alt='identificacion' style={{ width: '100%', marginBottom: '20px' }} />
                        <img src={`http://localhost:8080/carta-laboral/${dato.carta_laboral}`} alt='Carta Laboral' style={{ width: '100%', marginBottom: '20px' }} />
                        <h2>{dato.nombre}</h2>
                        <p>Dirección: {dato.direccion}</p>
                        <p>Teléfono: {dato.telefono}</p>
                        <p>Cumpleaños: {dato.cumple}</p>
                        <p>Puesto: {dato.puesto}</p>
                        <p>Empresa: {dato.empresa}</p>
                        <p>Antigüedad: {dato.antiguedad}</p>
                        <p>Sueldo inicial: {dato.sueldo_in}</p>
                        <p>Sueldo final: {dato.sueldo_final}</p>
                        <p>Monto: {dato.monto}</p>
                        <p>Fecha de inicio: {dato.fechaInicio}</p>
                        <p>Frecuencia de pago: {dato.frecuenciaPago}</p>
                        <p>Plazo: {dato.plazo}</p>
                    </div>
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
