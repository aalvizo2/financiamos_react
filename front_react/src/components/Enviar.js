import React, { useEffect, useState } from 'react'
import './css/enviar.css'
import Swal from 'sweetalert2'

export const Enviar = () => {
  const [datos, setDatos] = useState('');
  const [datos_laborales, setDatosLaborales] = useState('');
  const [identificacion, setIdentificacion] = useState('');

  useEffect(() => {
    try {
      // Obtener los datos de localStorage
      const datosPers = localStorage.getItem('datos');
      const datosLaborales = localStorage.getItem('datosLaborales');
      const identificacion = localStorage.getItem('fileName');

      // Establecer los datos en el estado
      setDatos(datosPers);
      setDatosLaborales(datosLaborales);
      setIdentificacion(identificacion);

    } catch (error) {
      console.error('Error al obtener los datos de localStorage:', error);
    }
  }, []);

  const handleSubmit = (event) => {
    // Prevenir el comportamiento por defecto del formulario
    event.preventDefault();

    // Crear un objeto con los datos que deseas enviar
    const formData = {
      datos: datos,
      datosLaborales: datos_laborales,
      identificacion: identificacion
    };

    // Enviar el formulario
    fetch('http://localhost:8080/enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        console.log('Formulario enviado con éxito')
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Formulario enviado con éxito',
            showCloseButton: true
          })
          window.location.href='/pendientes'
          localStorage.removeItem('datos')
          localStorage.removeItem('datosLaborales')
          localStorage.removeItem('fileName')
        // Puedes hacer algo aquí después de enviar el formulario
      } else {
        console.error('Error al enviar el formulario:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
    });
  };

  return (
    <div className='enviar-btn'>
      <form onSubmit={handleSubmit}>
        {/* Aquí se agregan los campos de input hidden con los datos */}
        <input type="hidden" name="datos" value={datos} />
        <input type="hidden" name="datos_laborales" value={datos_laborales} />
        <input type="hidden" name="identificacion" value={identificacion} />
        {/* Otros campos de formulario visibles, si los hay */}
        <button type="submit">Enviar</button>
      </form>
     
    </div>
  );
};

