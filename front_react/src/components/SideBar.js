import React from 'react'
import './css/sidebar.css'

export const SideBar = () => {
  return (
    <section className='sidebar'>
        <a href='/inicio'>Inicio</a>
        <a href='/registro'>Registro</a>
        <a href='/pendientes'>Pendientes</a>
        <a href='/credito'>Nuevo Credito</a>
        <a href='/indicador'>Indicador</a>
        <a href='/clientes'>Clientes</a>
    </section>
  )
}
export default SideBar