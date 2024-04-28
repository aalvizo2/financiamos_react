import React from 'react'
import './css/sidebar.css'

export const SideBar = () => {
  return (
    <section className='sidebar'>
        <a href='/inicio'>Inicio</a>
        <a href='/registro'>Registro</a>
        <a href='/inicio'>Pendientes</a>
        <a href='/pendientes'>Nuevo Credito</a>
        <a href='/indicador'>Pagos</a>
        <a href='/clientes'>Clientes</a>
    </section>
  )
}
export default SideBar