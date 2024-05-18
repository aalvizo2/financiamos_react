import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { ClientesLista } from '../components/Clientes'
export const Clientes = () => {
  return (
    <div>
        <NavBar/>
        <SideBar />
        <ClientesLista />
    </div>
  )
}
export default Clientes