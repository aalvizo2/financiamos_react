const express= require('express')
const Router= express.Router()
const connection= require('../routes/db')

Router.get('/check-user/:user', (req, res) => {
    const usuario = req.params.user;
    const query = 'SELECT role FROM admin WHERE usuario = ?';
  
    connection.query(query, [usuario], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener el rol del usuario' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const role = results[0].role;
      res.json({ role });
    });
  });

Router.post('/create-user', (req, res)=>{
    const {usuario, pass, role, permisos}= req.body
    console.log(req.body)
    const permisosJSON = JSON.stringify(permisos);
    connection.query('INSERT INTO admin (usuario, pass, role, permisos) VALUES (?,?,?,?)', [usuario, pass, role, permisosJSON], (err)=>{
        if(err)throw err 
        console.log('datos insertados correctamente')
    })
})
Router.put('/update/:usuario', (req, res)=>{
    const usuario= req.params.usuario
    const{pass}= req.body
    connection.query('UPDATE admin SET pass=? WHERE usuario=?', [pass, usuario], (err) =>{
        if(err) throw err
        console.log('contraseña actualizada correctamente')
    })
})
 
Router.get('/get-roles/:user', (req, res)=>{
    const usuario= req.params.user
    
    connection.query('SELECT role, permisos FROM admin WHERE usuario=?', [usuario], (err, datos)=>{
       if(err) throw err 
       const data= datos[0]
       
       res.json({datos: datos})
    })
})



module.exports= Router