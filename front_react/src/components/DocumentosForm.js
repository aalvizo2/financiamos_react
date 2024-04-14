import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import './css/registro_form.css'
const FileUploadForm = () => {
  const [file, setFile] = useState(null)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (file) {
        localStorage.setItem('fileName', file.name)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [file])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFileUpload = async () => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Enviar archivo al servidor
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Archivo subido:', response.data)
      setRedirect(true)
    } catch (error) {
      console.error('Error al subir el archivo:', error)
    }
  }

  return (
    <div className='registro'> 
      <h1>Documentos:</h1>
      <input type="file" onChange={handleFileChange} id="btn-file"/>
      <label htmlFor='btn-file'>Cedula</label>
      <button onClick={handleFileUpload}>Enviar</button>
      {redirect && <Navigate to='/vista_previa'/>}
    </div>
  )
}

export default FileUploadForm
