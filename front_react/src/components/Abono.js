import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/vista_previacredito.css'


export const Abono = () => {
  const [mensaje, setmensaje ]= useState('')
  useEffect(()=>{
    const getmensaje= async()=>{
      const response= await axios.get('http://localhost:8080/recibirPago')
      setmensaje(response.data.mensaje)
   }
   getmensaje()
  }, [])
  
  return (
    <div className='container'>
      <h2>Fecha de Pago:</h2>
      <p>mensaje: {mensaje}</p>
    </div>
  );
};
