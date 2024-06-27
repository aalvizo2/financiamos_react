const express = require('express');
const moment = require('moment');
const connection = require('./db');  // Asegúrate de que el path sea correcto
const Router = express.Router();

Router.get('/movimientos', (req, res) => {
  const { startDate, endDate } = req.query;
  const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

  const query = `
    SELECT nombre, abono, fecha_pago, saldo
    FROM movimientos
    WHERE fecha_pago BETWEEN ? AND ?
  `;

  connection.query(query, [formattedStartDate, formattedEndDate], (err, resultados) => {
    if (err) {
      console.error('Error al obtener movimientos:', err);
      res.status(500).json({ error: 'Error al obtener movimientos' });
      return;
    }
    res.json({ datos: resultados });
  });
});

module.exports = Router;
