import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/clientes.css';
import { Link} from 'react-router-dom';


export const NombreCliente = () => {
  const [nombres, setNombres] = useState([]);
  
  useEffect(() => {
    const getDatos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/datos');
        if (response.status === 200) {
          setNombres(response.data.datos);
        } else {
          console.error('Error al obtener los datos');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    getDatos();
  }, []);
  const guardarUsuario = (nombre)=>{
    localStorage.setItem('nombre_persona', nombre)
    
    window.location.href='/solicitud'
  }
  return (
    <div className='lista'>
      <h1>Clientes:</h1>
      <ul>
      {nombres.length > 0 ? (
        nombres.map((dato, index) => (
          <li key={index}>{dato.nombre}
          <a onClick={() => guardarUsuario(dato.nombre)}>Nuevo Prestamo</a>
            
         </li>

        ))
      ) : (
        <div>No hay datos para mostrar</div>
      )}
      </ul>
    </div>
  );
};

