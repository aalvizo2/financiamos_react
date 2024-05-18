const express = require('express');
const Router = express.Router();
const moment = require('moment');
const connection = require('./db');
require('moment/locale/es');

Router.get('/datos_prestamo', (req, res) => {
    const nombre = req.query.nombre;
    connection.query('SELECT * FROM usuarios WHERE nombre=?', [nombre], (err, datos) => {
        if (err) {
            console.error("Error al ejecutar la consulta SQL:", err);
            res.status(500).json({ error: "Error al ejecutar la consulta SQL" });
            return;
        }

        if (datos.length > 0) {
            const prestamo = datos[0];
            const monto = prestamo.monto;
            const plazo = prestamo.plazo;
            const interes = 1.05;
            const fechaInicio = prestamo.fechaInicio;
            const fechaInicial = moment(fechaInicio, 'YYYY-MM-DD');
            const frecuenciaPago = prestamo.frecuenciaPago;
            let montoTotal;

            if (frecuenciaPago === 'Quincenal') {
                if (plazo === '3 meses') {
                    montoTotal = monto * interes / 6;
                } else if (plazo === '1 año') {
                    montoTotal = monto * interes / 24;
                } else if (plazo === '2 años') {
                    montoTotal = monto * interes / 48;
                }
            } else if (frecuenciaPago === 'Mensual') {
                if (plazo === '3 meses') {
                    montoTotal = monto * interes / 3;
                } else if (plazo === '1 año') {
                    montoTotal = monto * interes / 12;
                } else if (plazo === '2 años') {
                    montoTotal = monto * interes / 24;
                }
            }

            res.json({ datos: datos, montoTotal: montoTotal });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

Router.get('/datosCliente/:cliente', (req, res) => {
    const nombre = req.params.cliente;
    connection.query('SELECT * FROM usuarios WHERE nombre=?', [nombre], (error, results) => {
        if (error) {
            console.error("Error al ejecutar la consulta SQL:", error);
            res.status(500).json({ error: "Error al ejecutar la consulta SQL" });
            return;
        }
        res.json(results);
    });
});

Router.put('/actualizarEstatus/:cliente', (req, res) => {
    const cliente = req.params.cliente;
    const { estatus, monto, fechaInicio, frecuenciaPago } = req.body;

    if (estatus === 'Aprobado') {
        connection.query('UPDATE usuarios SET estado = ? WHERE nombre = ?', [estatus, cliente], (err) => {
            if (err) {
                console.error('Error actualizando estado en usuarios:', err);
                res.status(500).send('Error actualizando estado');
                return;
            }

            console.log('Estado actualizado correctamente en usuarios');

            connection.query('INSERT INTO prestamos (nombre, monto, fechaInicio, frecuenciaPago) VALUES (?,?,?,?)', [cliente, monto, fechaInicio, frecuenciaPago], (err) => {
                if (err) {
                    console.error('Error insertando datos en prestamos:', err);
                    res.status(500).send('Error insertando datos en prestamos');
                    return;
                }

                console.log('Datos insertados correctamente en prestamos');
                res.send('Datos actualizados correctamente');
            });
        });
    } else if (estatus === 'Rechazado') {
        connection.query('UPDATE usuarios SET estado=? WHERE nombre=?', [estatus, cliente], (err) => {
            if (err) {
                console.error('Error actualizando estado en usuarios:', err);
                res.status(500).send('Error actualizando estado');
                return;
            }
            console.log('Prestamo Rechazado');
            res.send('Prestamo Rechazado');
        });
    }
});

Router.get('/listaClientes', (req, res) => {
    connection.query('SELECT nombre, estado FROM usuarios', (err, datos) => {
        if (err) {
            console.error('Error al buscar clientes:', err);
            res.status(500).json({ error: 'Error al buscar clientes' });
            return;
        }
        res.json({ datos: datos });
    });
});

Router.post('/filtrarCliente', (req, res) => {
    const { buscar } = req.body;
    connection.query('SELECT * FROM prestamos WHERE nombre LIKE ?', [`%${buscar}%`], (err, results) => {
        if (err) {
            console.error('Error al buscar usuarios:', err);
            res.status(500).json({ error: 'Error al buscar usuarios' });
            return;
        }

        if (results.length > 0) {
            const datosFormateados = results.map(cliente => ({
                ...cliente,
                fechaInicio: moment(cliente.fechaInicio).format('YYYY-MM-DD'),
                fechaPago: moment(cliente.fechaPago).format('YYYY-MM-DD')
            }));
            res.json({ resultados: datosFormateados });
        } else {
            res.json({ resultados: [] });
        }
    });
});

Router.post('/actualizarPago', (req, res) => {
    const { nombre, monto, fechaInicio, fechaPago, abono } = req.body;

    connection.query(
        'UPDATE prestamos SET monto = ?, fechaInicio = ?, fechaPago = ? WHERE nombre = ?', 
        [monto, moment(fechaInicio, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD'), moment(fechaPago, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD'), nombre], 
        (err, resultados) => {
            if (err) {
                console.error('Error al actualizar el pago:', err);
                return res.status(500).json({ error: 'Error al actualizar el pago' });
            }
            res.json({ message: 'Pago actualizado con éxito' });

            // Insertar movimiento en la tabla de movimientos
            connection.query(
                'INSERT INTO movimientos (nombre, fecha_pago, abono) VALUES (?, ?, ?)',
                [nombre, moment().format('YYYY-MM-DD'), abono],
                (err, resultados) => {
                    if (err) {
                        console.error('Error al insertar el movimiento:', err);
                        return res.status(500).json({ error: 'Error al insertar el movimiento' });
                    }
                    res.json({ message: 'Pago actualizado con éxito' });
                }
            );
        }
    );
});


module.exports = Router;
