const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const login = require('./routes/login')
const app = express();
const credito= require('./routes/credito')
const upload= require('./routes/upload')
const plazo= require('./routes/plazo')
const path= require('path')

// Configuración de middlewares
app.use(bodyParser.json());
//setting up /cedula folder
app.use('/cedula', express.static(path.join(__dirname, 'cedula')))
// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Configuración de sesión
app.use(session({
  resave: false, 
  secret: 'hola mundo', 
  saveUninitialized: true, 
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))

// Definición de rutas
app.use('/', login)
app.use('/', credito)
app.use('/', upload)
app.use('/', plazo)
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola Mundo');
})

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
})

