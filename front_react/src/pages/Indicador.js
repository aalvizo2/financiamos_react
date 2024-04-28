import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Pagos } from '../components/Pagos'

export const Indicador = () => {

  return (
    <div>
        <NavBar/>
        <SideBar />
        <Pagos />
    </div>
  )
}
export default Indicador