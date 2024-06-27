import React from 'react'
import { VistaPrevia } from '../components/VistaPrevia'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Enviar } from '../components/Enviar'

export const VistaPreviaDoc = () => {
  return (
    <div>
        
        <VistaPrevia />
        <Enviar />
    </div>
  )
}
