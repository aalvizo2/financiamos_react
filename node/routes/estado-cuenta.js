const express = require('express');
const moment = require('moment');
const connection = require('./db');
const Router = express.Router();

Router.get('/lista-clientes', (req, res) => {
    connection.query('SELECT nombre, MAX(fecha_pago) AS ultima_fecha_pago FROM movimientos GROUP BY nombre', (err, resultados) => {
      if (err) {
        console.error('Error al obtener la lista de clientes:', err);
        res.status(500).json({ error: 'Error al obtener la lista de clientes' });
        return;
      }
      res.json({ datos: resultados });
    });
  });
  
  Router.get('/estado-cuenta/:cliente', (req, res) => {
    const cliente = req.params.cliente;
    connection.query('SELECT abono, fecha_pago FROM movimientos WHERE nombre=?', [cliente], (err, datos)=>{
        if(err) throw err
        console.log(datos)
        res.json({estadoCuenta: datos})
    })
  });
  

module.exports = Router;
