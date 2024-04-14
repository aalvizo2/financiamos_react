import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import FileUploadForm from '../components/DocumentosForm'
export const Documentos = () => {
  return (
    <div>
        <NavBar />
        <SideBar />
        <FileUploadForm />
    </div>
  )
}
export default Documentos