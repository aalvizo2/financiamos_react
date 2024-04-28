import React, { useState } from 'react';
import axios from 'axios';

export const Pagos = () => {
  const [buscar, setBuscar] = useState('');
  const [resultados, setResultados] = useState([]);

  const formulario = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/pago', { buscar });
      if (response.data && Array.isArray(response.data.resultados)) {
        setResultados(response.data.resultados);
      } else {
        setResultados([]); // Establecer resultados como un array vacío si no se reciben datos válidos
      }
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
    }
  }

  const pagar = (nombre) => {
    axios.get(`http://localhost:8080/pagar?nombre=${nombre}`)
      .then(response => {
        // Manejar la respuesta según sea necesario
        console.log(response);
      })
      .catch(error => {
        // Manejar errores
        console.error(error);
      });
  }

  return (
    <div className='container'>
      <form onSubmit={formulario}>
        <input type='text' onChange={(e) => { setBuscar(e.target.value) }} placeholder='Buscar un Cliente' />
        <input type='submit' value='Buscar' />
      </form>
      {resultados.length > 0 ? (
        <div>
          {resultados.map((usuario) => (
            <div key={usuario.nombre} className='listado'>
              {usuario.nombre} <a href='/pagar' onClick={() => pagar(usuario.nombre)}>Abono</a>
            </div>
          ))}
        </div>
      ) : (
        <div>No hay resultados en la búsqueda</div>
      )}
    </div>
  );
};
