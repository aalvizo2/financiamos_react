import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Abono } from '../components/Abono'

export const Indicador = () => {

  return (
    <div>
        <NavBar/>
        <SideBar />
        <Abono />
    </div>
  )
}
export default Indicador