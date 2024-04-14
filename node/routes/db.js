const mysql= require('mysql')


const connection= mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: '123456789', 
    database: 'financiamos'
})
connection.connect((error)=>{
    if(error) throw error 
    console.log('conectado a la base de datos correctamente')
})
module.exports= connection