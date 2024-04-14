import React, { useEffect, useState } from 'react'
import './css/registro_form.css'
import { Navigate } from 'react-router-dom'

 const FormRegistro = () => {

const [nombre, setNombre]= useState('')
const [direccion, setDireccion]= useState('')
const [telefono, setTelefono]= useState('')
const [cumple, setCumple]= useState('')
const [cp, setCP]= useState('')
const [colonia, setColonia]= useState('')
const [ciudad, setCiudad]= useState('')
const [pais, setPais]= useState('')
const [successRedirect, setSuccessRedirect]= useState('')
useEffect(()=>{
   const handleBeforeUnload= (e)=>{
    const datos= {
      nombre, 
      direccion, 
      telefono,
      cumple, 
      cp, 
      colonia, 
      ciudad, 
      pais
    }
    localStorage.set('datos', JSON.stringify(datos))
   }
   window.addEventListener('beforeunload', handleBeforeUnload)
}, [nombre])
const Registrar= async(e )=>{
 e.preventDefault()
    try{
       const datos= {
        nombre, 
        direccion, 
        telefono,
        cumple, 
        cp, 
        colonia, 
        ciudad, 
        pais
      }
      localStorage.setItem('datos', JSON.stringify(datos))
      setSuccessRedirect(true)
      console.log(datos)
       
    }catch(error){
      console.error('Error al enviar los datos', error)
    }
}
  return (
    <section className='registro'>
        <h1>Información Personal:</h1>
        <form onSubmit={Registrar}>
            <input type='text'
             value={nombre}
             onChange={(e)=> setNombre(e.target.value)}
             placeholder='Nombre Completo:'/>
             <input type='text'
             value={direccion}
             onChange={(e)=> setDireccion(e.target.value)}
             placeholder='Dirección:'/>
             <input type='text'
             value={telefono}
             onChange={(e)=> setTelefono(e.target.value)}
             placeholder='Télefono:'/>
             <input type='date'
             value={cumple}
             onChange={(e)=> setCumple(e.target.value)}
             placeholder='Fecha de Nacimiento:'/>
             <input type='text'
             value={cp}
             onChange={(e)=> setCP(e.target.value)}
             placeholder='Código Postal:'/>
             <input type='text'
             value={colonia}
             onChange={(e)=> setColonia(e.target.value)}
             placeholder='Colonia:'/>
             <input type='text'
             value={ciudad}
             onChange={(e)=> setCiudad(e.target.value)}
             placeholder='Ciudad:'/>
             <input type='text'
             value={pais}
             onChange={(e)=> setPais(e.target.value)}
             placeholder='País:'/><br></br>
             <input type='submit' value='Ingresar' />
             {successRedirect && <Navigate to='/datos_laborales'/>}
        </form>
    </section>
  )
}
export default FormRegistro