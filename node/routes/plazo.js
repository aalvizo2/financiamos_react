const express= require('express')
const Router= express.Router()
const moment= require('moment')
const connection= require('./db')
console.log('Hola desde plazo')
require('moment/locale/es')



console.log('Hola desde plazo')
Router.get('/datos_prestamo', (req, res)=>{
    const nombre= req.query.nombre
    console.log(nombre)
    connection.query('SELECT monto, fechaInicio, frecuenciaPago, plazo FROM usuarios WHERE nombre=? ', [nombre], (err, datos)=>{
        if(err) throw err 
        console.log(datos)
        const prestamo= datos[0]
        const monto= datos[0].monto
        const plazo= datos[0].plazo
        const interes= 1.05
        const fechaInicio= datos[0].fechaInicio
        const fechaInicial = moment(prestamo.fechaInicio, 'DD [de] MMMM [de] YYYY')
        const frecuenciaPago= prestamo.frecuenciaPago
        let montoTotal
        console.log(fechaInicial.add(1, 'month'))
        if(frecuenciaPago === 'Quincenal'){
           if(plazo === '3 meses'){
              montoTotal= monto * interes /6
           }else if(plazo === '1 año'){
              montoTotal= monto * interes /24
           }else if(plazo === '2 años'){
              montoTotal= monto * interes /48
           }
        }else if(frecuenciaPago === 'Mensual'){
            if(plazo=== '3 meses'){
                montoTotal= monto * interes / 3
                console.log(montoTotal)
            }else if(plazo === '1 año'){
                montoTotal= monto * interes /12
            }else if(plazo === '2 años'){
                montoTotal= monto * interes / 24
            }
        }
        const pagos= []
       
        res.json({datos: datos, montoTotal: montoTotal})
    })
})
Router.post('/pago', (req, res)=>{
    const {buscar}= req.body
    connection.query('SELECT * FROM usuarios WHERE nombre LIKE ?', ['%' + buscar + '%'], (err, resultados)=>{
        if(err) throw err 
        res.json({resultados: resultados})
        console.log(resultados)
    })
})

Router.get('/pagar', (req, res)=>{
    console.log(req.query.nombre)
    const nombre= req.query.nombre
    connection.query('SELECT * FROM usuarios WHERE nombre=?', [nombre], (err, datos)=>{
     if(datos.length >0){
        if(err) throw err 
        console.log(datos)
        const {fechaInicio, frecuenciaPago, plazo, monto, nombre}= datos[0]
        console.log(fechaInicio)
        const plazoInicial= moment(fechaInicio, 'DD [de] MMMM [de] YYYY')
        
        let fechaDePago
        if(frecuenciaPago === 'Mensual'){
            fechaDePago= plazoInicial.add(1,'month').format('DD [de] MMMM [de] YYYY')
            console.log(fechaDePago)
        }
        if(frecuenciaPago === 'Quincenal'){
            fechaDePago= plazoInicial.add(15, 'days').format('DD [de] MMMM [de] YYYY')
            console.log(fechaDePago)
        }
        connection.query('INSERT INTO prestamos (nombre, monto, fechaInicio, fechaPago, frecuenciaPago) VALUES(?,?,?,?,?)', [nombre, monto, fechaInicio, fechaDePago, frecuenciaPago], (err)=>{
            if(err) throw err
            console.log('datos insertados en tabla de prestamos ')
        });
        
        res.json({mensaje: 'hola desde el backend'
        })
     }else{
        console.log('No se encontraron datos')
     }
    })
})
Router.get('/recibirPago', (req, res)=>{
    res.json({mensaje: 'hola mundo desde backend'})
    console.log(moment().format('DD [de] MMMM [de] YYYY'))
})




module.exports = Router;


module.exports= Router