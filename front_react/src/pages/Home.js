
import React, { useState } from 'react'
import '../components/css/home.css'
import logo from '../components/img/financiera.png'
import axios from 'axios'
import { Navigate } from 'react-router-dom'

const MainBar= ()=>{
  return(
    <section className='mainbar'>
      <div className='logo'>
        <img src={ logo } alt='Logo'></img>
      </div>
    </section>
  )
}

const Form= ()=>{
  const [usuario, setUsuario]= useState('')
  const [pass, setPass]= useState('')
  const [error, setError]= useState('')
  const [successRedirect, setSuccessRedirect]= useState(false)

  const HandleSubmit = async(e)=>{
    e.preventDefault()
    try{
      await axios.post('http://localhost:8080/auth', {
        usuario, 
        pass
      })
      console.log('Respuesta del servidor')
      
      // Guardar el usuario en localStorage
      localStorage.setItem('usuario', usuario)
      
      setSuccessRedirect(true)
      setError()
    }
    catch (error){
      console.error('Error al enviar el formulario', error)
      if(error.response && error.response.status === 401){
        setError('Credenciales Incorrectas')
      } else {
        setError('Ocurrió un error. Por favor intenta más tarde')
      }
    }
  }

  return(
    <div className='formulario'>
      <h1>Iniciar Sesión:</h1>
      {error && <div className='error'>{error}</div>}
      <form onSubmit={HandleSubmit}>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e)=> setUsuario(e.target.value)}
          placeholder='Usuario :'
        />
        <input
          type="password"
          id="pass"
          value={pass}
          onChange={(e)=> setPass(e.target.value)}
          placeholder='Contraseña :'
        /><br />
        <button type="submit">Ingresar</button>
        {successRedirect && <Navigate to='/inicio' />}
      </form>
    </div>
  )
}

export const Home = () => {
  return (
    <div>
      <MainBar />
      <Form />
    </div>
  )
}

export default Home
