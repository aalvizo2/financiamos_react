const express = require('express')
const Router = express.Router()
const connection = require('./db')
const { json } = require('body-parser')

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
/*Router.get('/datos', (req, res) => {
  connection.query('SELECT nombre FROM usuarios', (err, datos) => {
    if (err) {
      console.error('Error al obtener los datos:', err)
      res.status(500).send('Error interno del servidor')
      return;
    }
    const nombres = datos.map(usuario => usuario.nombre)
    
    res.json({ nombres })
  })
})*/
Router.get('/datos', (req,res)=>{
  connection.query('SELECT * FROM usuarios', (err, datos)=>{
    if(err) throw err 
    res.json({datos: datos})
  })
})
Router.put('/solicitud', (req, res) => {
  const { nombre, monto, frecuenciaPago, fechaInicio, plazo } = req.body
  console.log(req.body)

  // Convertir el timestamp en una fecha
  const timestamp = 625551470362220; // tu timestamp aquí

  // Convertir el timestamp en una fecha
  const fecha = new Date(timestamp);
  
  // Obtener la fecha del año siguiente
  fecha.setFullYear(fecha.getFullYear() + 1);
  
  // Formatear la fecha como una cadena legible
  const fechaLegible = fecha.toLocaleDateString('es-ES', {
    weekday: 'long', // día de la semana como nombre completo
    year: 'numeric', // año como número
    month: 'long', // mes como nombre completo
    day: 'numeric' // día del mes como número
  });
  
  console.log(fechaLegible);
  connection.query(
    'UPDATE usuarios SET monto=?, frecuenciaPago=?, fechaInicio=?, plazo=? WHERE nombre=?',
    [monto, frecuenciaPago, fechaInicio, plazo,  nombre],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar los datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        console.log('Datos actualizados correctamente');
        res.status(200).json({ message: 'Datos actualizados correctamente' })
        
      }
    }
  )

});




module.exports = Router



