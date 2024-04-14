const express = require('express');
const Router = express();
const connection = require('./db');
const { Console } = require('console');

console.log('hola desde credito');

Router.use(express.json()); // Middleware para parsear el cuerpo de la solicitud como JSON

Router.post('/registrar', (req, res) => {
    const datos = req.body.datos; // Aquí recibimos todos los datos en un objeto JSON

    // Desestructuramos el objeto para obtener los campos individuales
    const { nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais } = datos;

    console.log(datos);

    connection.query('INSERT INTO usuarios (nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais) VALUES (?,?,?,?,?,?,?,?)',
        [nombre, direccion, telefono, cumple, cp, colonia, ciudad, pais],
        (err) => {
            if (err) {
                console.error('Error al conectar:', err);
                res.status(400).send('Error al conectar');
            } else {
                console.log('Datos insertados correctamente');
                res.status(200).send('Datos insertados correctamente');
            }
        });
})
Router.post('/registrar-datos-laborales', (req, res)=>{
    const datos = req.body;
    console.log(datos);
    const { puesto, empresa, antiguedad, sueldo_in, sueldo_final} = datos; // Extraer los valores individuales de datos
    connection.query('INSERT INTO usuarios(puesto, empresa, antiguedad, sueldo_in, sueldo_final) VALUES(?,?,?,?,?)', [puesto, empresa, antiguedad, sueldo_in, sueldo_final], (err)=>{
      if(err) {
        res.status(500).json({ error: 'Error al insertar datos laborales' }); // Enviar un objeto JSON con el mensaje de error
      } else {
        console.log('Datos laborales insertados');
        res.status(200).json({ message: 'Datos laborales insertados correctamente' }); // Enviar un objeto JSON con el mensaje de éxito
      }
    })
 })
 
module.exports = Router

