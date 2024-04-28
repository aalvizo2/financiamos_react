import React, { useState } from 'react';
import './css/registro_form.css';
import { useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'

export const Solicitud = (props) => {
  // Verifica si props.location.state está definido antes de acceder a nombre
  const [nombre, setNombre]= useState('')
  const [monto, setMonto]= useState(0)
  const [frecuenciaPago, setfrecuenciaPago]= useState('')
  const [plazo, setplazo]= useState('')
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date())); // Initialize with today's date
 

  // Function to format the date as "dd de MMMM de yyyy" (e.g., "20 de abril de 2024")
  function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  useEffect(()=>{
   const usuario= localStorage.getItem('nombre_persona')
   setNombre(usuario)
  }, [])
  const actualizar = async(e) => {
    e.preventDefault();
    console.log('actualizando datos')
    try {
      Swal.fire({
        icon: 'success',
        title: 'Exito'
      })
      window.location.href='/vista_previacredito'
      await axios.put('http://localhost:8080/solicitud', {
        nombre,
        monto, 
        frecuenciaPago, 
        fechaInicio, 
        plazo
      })  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.'
      });
    }
  };
  
  return (
    <div className='registro'>
      <h1>Monto del Préstamo para {nombre}</h1>
      <form onSubmit={actualizar}>
        <input type='hidden' value={nombre} onChange={(e)=>setNombre(e.target.value)}/>
        <input type='number' value={monto} onChange={(e)=>setMonto(e.target.value)} placeholder='Monto'/>
        {monto > 2000000 && (
          <div className='alert'>Monto no puede ser mayor a 2,000,000.00 de pesos</div>
        )}
        <select value={frecuenciaPago} onChange={(e)=>setfrecuenciaPago(e.target.value)}>
          <option>Selecciona Plazo de </option>
          <option value='Quincenal'>Quincenal</option>
          <option value='Mensual'>Mensual</option>
        </select>
        <select value={plazo} onChange={(e)=>setplazo(e.target.value)}>
          <option>Plazo a pagar</option>
          <option value='3 meses'>3 Meses</option>
          <option value='1 año'>1 año</option>
          <option value='2 años'>2 años</option>
        </select>

        <input type='hidden' value={fechaInicio} onChange={(e)=>setFechaInicio(e.target.value)} />
        <input type='submit' value='Ingresar Datos' />
        
      </form>
    </div>
  )
}
