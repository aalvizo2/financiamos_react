import React, { useEffect, useState } from 'react';
import './css/enviar.css';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RUTA } from '../route';

export const Enviar = () => {
  const [datos, setDatos] = useState('');
  const [datosLaborales, setDatosLaborales] = useState('');
  const [cedula, setCedula] = useState('');
  const [cartaLaboral, setCartaLaboral] = useState('');
  const [referencias, setReferencias] = useState('');
  const [referenciaFamiliar, setReferenciaFamiliar] = useState('');
  const [referenciaLaboral, setReferenciaLaboral] = useState('');
  const [formatoReferencias, setFormatoReferencias] = useState('');
  const [paga, setPaga] = useState('');
  const [servicios, setServicios] = useState('');
  const navigate= useNavigate();
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

      //documentos 
      setCedula(localStorage.getItem('cedula') || '');
      setCartaLaboral(localStorage.getItem('cartaLaboral') || '');
      setReferenciaFamiliar(localStorage.getItem('referenciaFamiliar') || '');
      setReferenciaLaboral(localStorage.getItem('referenciaLaboral') || '');
      setFormatoReferencias(localStorage.getItem('formatoReferencias') || '');
      setPaga(localStorage.getItem('pagare') || '');
      setServicios(localStorage.getItem('servicios') || '');
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
      referencias: referencias,
      referenciaFamiliar: referenciaFamiliar,
      referenciaLaboral: referenciaFamiliar,
      formatoReferencias: formatoReferencias,
      paga: paga, 
      servicios: servicios,
    };

    try {
      const response = await fetch(`${RUTA}/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        message.success('Solicitud realizada correctamente');
        navigate('/pendientes');
        localStorage.removeItem('datos');
        localStorage.removeItem('datosLaborales');
        localStorage.removeItem('cedula');
        localStorage.removeItem('cartaLaboral');
        localStorage.removeItem('referencias');
        localStorage.removeItem('servicios');
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
        <input type="hidden" name="referenciaFamiliar" value={referenciaFamiliar} />
        <input type="hidden" name="referenciaLaboral" value={referenciaLaboral} />
        <input type="hidden" name="paga" value={paga} />
        <input type="hidden" name="formatoReferencias" value={formatoReferencias} />
        {/* Otros campos de formulario visibles, si los hay */}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
