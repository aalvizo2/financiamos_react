import React, { useState, useEffect, Select} from 'react';
import './css/vista_previa.css';
const Option= Select

export const VistaPrevia = () => {
  const [datos, setDatos] = useState('');
  const [datos_laborales, setDatosLAborales] = useState('')
  const[identificacion, setIdentificacion] = useState('')

  useEffect(() => {
    const getDatos = () => {
      const Data = localStorage.getItem('datos');
      if (Data) {
        const ParsedData = JSON.parse(Data);
        setDatos(ParsedData)
      }
    }

    getDatos()
  }, [])

  useEffect(() => {
    const getDatosLaborales = () => {
      const DatosLaborales = localStorage.getItem('datosLaborales')
      if (DatosLaborales) {
        const DatosSinCadena = JSON.parse(DatosLaborales)
        setDatosLAborales(DatosSinCadena)
      }
    }

    getDatosLaborales()
  }, [])
  useEffect(()=>{
    const getDocumento= ()=>{
      const FileName= localStorage.getItem('fileName')
      setIdentificacion(FileName)
      
    } 
    getDocumento()
  }, [])

  return (
    <div className='contenedor'>
      <section className='datos'>
        <h1>Datos Personales:</h1>
        <p><span>Nombre:</span> {datos.nombre}</p>
        <p><span>Dirección:</span> {datos.direccion}</p>
        <p><span>Télefono:</span> {datos.telefono}</p>
        <p><span>Cp:</span> {datos.cp}</p>
        <p><span>Ciudad:</span> {datos.ciudad}</p>
        <p><span>Colonia:</span> {datos.colonia}</p>
        <p><span>Pais:</span> {datos.pais}</p>
      </section>
      <section className='datos'>
        <h1>Datos Laborales:</h1>
        <p><span>Puesto:</span> {datos_laborales.puesto}</p>
        <p><span>Empresa:</span> {datos_laborales.empresa}</p>
        <p><span>Antigüedad:</span> {datos_laborales.antiguedad}</p>
        <p><span>Sueldo Inicial:</span> {datos_laborales.sueldo_in}</p>
        <p><span>Sueldo Final:</span> {datos_laborales.sueldo_final}</p>
      </section>
      <section className='identificacion'>
        <img src={`http://localhost:8080/cedula/${datos.identificacion}`} alt='identificacion'/>
      </section>
    </div>
    
  );
};
