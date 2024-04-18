const express = require('express')
const Router = express.Router()
const connection = require('./db')

Router.use(express.json()) // Middleware para parsear el cuerpo de la solicitud como JSON

Router.post('/enviar', (req, res) => {
  const { datos, datosLaborales, identificacion } = req.body

  const sql = `
    INSERT INTO usuarios (nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais, puesto, empresa, antiguedad, sueldo_in, sueldo_final, identificacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const { nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais } = JSON.parse(datos)
  const { puesto, empresa, antiguedad, sueldo_in, sueldo_final } = JSON.parse(datosLaborales)

  connection.query(sql, [nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais, puesto, empresa, antiguedad, sueldo_in, sueldo_final, identificacion], (error, results, fields) => {
    if (error) {
      console.error('Error al insertar en la base de datos:', error)
      res.status(500).send('Error interno del servidor')
      return
    }
    console.log('Datos insertados correctamente en la base de datos')
    res.sendStatus(200)
  })
})
Router.get('/datos', (req, res)=>{
  
})

module.exports = Router



