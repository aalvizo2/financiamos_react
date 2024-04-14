import React from 'react'
import DatosLaboralesForm from '../components/DatosLaboralesForm'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import DocumentosForm from '../components/DocumentosForm'
export const DatosLaborales = () => {
  return (
    <div>
       <NavBar />
       <SideBar />
       <DatosLaboralesForm/>
       
    </div>
  )
}
export default DatosLaborales
