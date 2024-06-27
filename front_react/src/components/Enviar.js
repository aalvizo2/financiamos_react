import React, { useEffect, useState } from 'react';
import './css/enviar.css';
import { message } from 'antd';

export const Enviar = () => {
  const [datos, setDatos] = useState('');
  const [datosLaborales, setDatosLaborales] = useState('');
  const [cedula, setCedula] = useState('');
  const [cartaLaboral, setCartaLaboral] = useState('');
  const [referencias, setReferencias] = useState('');

  useEffect(() => {
    try {
      // Obtener los datos de localStorage
      const datosPers = localStorage.getItem('datos');
      const datosLaborales = localStorage.getItem('datosLaborales');
      const cedula = localStorage.getItem('cedula');
      const cartaLaboral = localStorage.getItem('cartaLaboral');
      const referencias = localStorage.getItem('referencias');

      // Establecer los datos en el estado
      setDatos(datosPers);
      setDatosLaborales(datosLaborales);
      setCedula(cedula);
      setCartaLaboral(cartaLaboral);
      setReferencias(referencias);
    } catch (error) {
      console.error('Error al obtener los datos de localStorage:', error);
    }
  }, []);

  const handleSubmit = async (event) => {
    // Prevenir el comportamiento por defecto del formulario
    event.preventDefault();

    // Crear un objeto con los datos que deseas enviar
    const formData = {
      datos: datos,
      datosLaborales: datosLaborales,
      cedula: cedula, 
      cartaLaboral: cartaLaboral,
      referencias: referencias
    };

    try {
      const response = await fetch('http://localhost:8080/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        message.success('Solicitud realizada correctamente');
        window.location.href = '/pendientes';
        localStorage.removeItem('datos');
        localStorage.removeItem('datosLaborales');
        localStorage.removeItem('cedula');
        localStorage.removeItem('cartaLaboral');
        localStorage.removeItem('referencias');
      } else {
        console.error('Error al enviar el formulario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className='enviar-btn'>
      <form onSubmit={handleSubmit}>
        {/* Aquí se agregan los campos de input hidden con los datos */}
        <input type="hidden" name="datos" value={datos} />
        <input type="hidden" name="datos_laborales" value={datosLaborales} />
        <input type="hidden" name="cedula" value={cedula} />
        <input type="hidden" name="cartaLaboral" value={cartaLaboral} />
        <input type="hidden" name="referencias" value={referencias} />
        {/* Otros campos de formulario visibles, si los hay */}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
