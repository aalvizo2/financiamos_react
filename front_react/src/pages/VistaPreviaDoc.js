import React from 'react'
import { VistaPrevia } from '../components/VistaPrevia'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'

export const VistaPreviaDoc = () => {
  return (
    <div>
        <NavBar />
        <SideBar />
        <VistaPrevia />
    </div>
  )
}
