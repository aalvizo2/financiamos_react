import React, { useEffect, useState } from 'react'
import './css/registro_form.css'
import { Navigate } from 'react-router-dom';

const DatosLaboralesForm = () => {
  const [puesto, setPuesto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [antiguedad, setAntiguedad] = useState('');
  const [sueldo_in, setSueldoInicial]= useState('')
  const[sueldo_final, setSueldoFinal]= useState('')
  const [successRedirect, setSuccessRedirect]= useState('')
  useEffect(()=>{
    const AntesDeNoCargar= (e)=>{
      const datosLaborales = {
        puesto,
        empresa,
        antiguedad,
        sueldo_in, 
        sueldo_final
      }
      localStorage.setItem('datos_laborales', JSON.stringify(datosLaborales))
    }
    window.addEventListener('antesdecargar', AntesDeNoCargar)
   
  }, [puesto])
  const RegistrarDatosLaborales = async (e) => {
    e.preventDefault();
    try {
      const datosLaborales = {
        puesto,
        empresa,
        antiguedad,
        sueldo_in, 
        sueldo_final
      }
      localStorage.setItem('datosLaborales', JSON.stringify(datosLaborales))
      setSuccessRedirect(true)
      console.log(datosLaborales)
    } catch (error) {
      console.error('Error al enviar los datos laborales', error);
    }
  };

  return (
    <section className='registro'>
      <h1>Información Laboral:</h1>
      <form onSubmit={RegistrarDatosLaborales}>
        <input
          type='text'
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          placeholder='Puesto:'
        />
        <input
          type='text'
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          placeholder='Empresa:'
        />
        <input
          type='text'
          value={antiguedad}
          onChange={(e) => setAntiguedad(e.target.value)}
          placeholder='Antigüedad:'
        />
        <input
          type='number'
          value={sueldo_in}
          onChange={(e) => setSueldoInicial(e.target.value)}
          placeholder='Sueldo Inicial:'
        />
        <input
          type='number'
          value={sueldo_final} onChange={(e) => setSueldoFinal(e.target.value)}
          placeholder='Sueldo Final:'
        />
        <br />
        <input type='submit' value='Ingresar' />
        {successRedirect && <Navigate to='/documentos'/>}
      </form>
    </section>
  );
};

export default DatosLaboralesForm