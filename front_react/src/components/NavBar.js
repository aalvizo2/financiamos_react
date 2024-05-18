import React, { useEffect, useState } from 'react';
import './css/navbar.css';
import logo from './img/financiera.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navigate } from 'react-router-dom';

export const NavBar = () => {
  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const getUsuario = () => {
      const storedUsuario = localStorage.getItem('usuario');
      if (storedUsuario) {
        setUsuario(storedUsuario);
      }else{
        window.location.href='/'
      }
    };
    getUsuario();
  }, [])
  const handleLogout= ()=>{
    localStorage.removeItem('usuario')
    setUsuario(null)
    console.log('sesion cerrada correctamente')
  }

  return (
   <>
    <nav>
      <img src={logo} alt='Logo Financiamos' />
      <div className='links'>
        <a href='#'>{usuario}</a>
        <a href='#' onClick={handleLogout}>Cerrar Sesión</a>
        {usuario === null && <Navigate to="/" />}
      </div>
    </nav>
    <div className='espacio'></div>
   </>
   
  );
};

export default NavBar
