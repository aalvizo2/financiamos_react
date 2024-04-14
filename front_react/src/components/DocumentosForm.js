import React, { useState } from 'react';
import axios from 'axios';

import './css/files.css';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    localStorage.setItem('fileName', selectedFile.name)
    window.location.href='/vista_previa'
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Enviar archivo al servidor
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Archivo subido:', response.data);
      window.location.href='/vista_previa'
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  return (
    <div className="documentos">
      <h1>Documentos:</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} id="btn-file" />
        <label htmlFor="btn-file">Cedula</label><br />
        <button type="submit">Enviar</button>
      </form>
      
    </div>
  );
};

export default FileUploadForm;
