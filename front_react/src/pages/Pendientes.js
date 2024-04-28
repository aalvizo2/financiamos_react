import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { NombreCliente } from '../components/NombreCliente'
export const Pendientes = () => {
  return (
    <div>
        <NavBar/>
        <SideBar />
        <NombreCliente />
    </div>
  )
}
export default Pendientes