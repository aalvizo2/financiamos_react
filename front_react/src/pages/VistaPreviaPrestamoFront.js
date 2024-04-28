import React from 'react'
import { VistaPreviaPrestamoDatos } from '../components/VistaPreviaPrestamoDatos'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
export const VistaPreviaPrestamoFront = () => {
  return (
    <div>
      <NavBar />
      <SideBar />
      <VistaPreviaPrestamoDatos />
    </div>
  )
}
