const express = require('express');
const path = require('path');
const Router = express.Router();
const fileUpload = require('express-fileupload');

Router.use(fileUpload());

// Configurar para servir archivos estáticos
Router.use('/cedula', express.static(path.join(__dirname, 'cedula')));
Router.use('/carta-laboral', express.static(path.join(__dirname, 'carta-laboral')));
Router.use('/formato-referencias', express.static(path.join(__dirname, 'formato-referencias')));
Router.use('/pagare', express.static(path.join(__dirname, 'pagare')));
Router.use('/referencia-familiar', express.static(path.join(__dirname, 'referencia-familiar')));
Router.use('/referencia-laboral', express.static(path.join(__dirname, 'referencia-laboral')));

Router.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({message:'Favor de subir un archivo'});
  }

  const {
    cedula,
    cartaLaboral,
    formatoReferencias,
    pagare,
    referenciaFamiliar,
    referenciaLaboral,
  } = req.files;

  const moveFilesPromises = [];

  const uploadFile = (file, directory) => {
    if (file) {
      const filePath = path.join(__dirname, directory, file.name);
      return new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    return Promise.resolve();
  };

  moveFilesPromises.push(uploadFile(cedula, 'cedula'));
  moveFilesPromises.push(uploadFile(cartaLaboral, 'carta-laboral'));
  moveFilesPromises.push(uploadFile(formatoReferencias, 'formato_referencias'));
  moveFilesPromises.push(uploadFile(pagare, 'pagare'));
  moveFilesPromises.push(uploadFile(referenciaFamiliar, 'referencia_familiar'));
  moveFilesPromises.push(uploadFile(referenciaLaboral, 'referencia_laboral'));

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
