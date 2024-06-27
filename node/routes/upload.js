const express = require('express');
const path = require('path');
const Router = express.Router();
const fileUpload = require('express-fileupload');

Router.use(fileUpload());

// Configurar para servir archivos estáticos
Router.use('/cedula', express.static(path.join(__dirname, 'cedula')));
Router.use('/carta-laboral', express.static(path.join(__dirname, 'carta-laboral')));

Router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const { cedula, cartaLaboral } = req.files;
  const moveFilesPromises = [];

  if (cedula) {
    const cedulaPath = path.join(__dirname, 'cedula', cedula.name);
    moveFilesPromises.push(new Promise((resolve, reject) => {
      cedula.mv(cedulaPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }));
  }

  if (cartaLaboral) {
    const cartaLaboralPath = path.join(__dirname, 'carta-laboral', cartaLaboral.name);
    moveFilesPromises.push(new Promise((resolve, reject) => {
      cartaLaboral.mv(cartaLaboralPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    }));
  }

  Promise.all(moveFilesPromises)
    .then(() => {
      res.send('Files uploaded!');
    })
    .catch((err) => {
      console.error('Error al mover archivos:', err);
      res.status(500).send('Error al mover archivos.');
    });
});

module.exports = Router;
