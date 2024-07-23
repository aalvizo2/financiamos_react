import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Input, Button, Typography, Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/es'; // Importa el locale en español
import ReactToPrint from 'react-to-print';
import MainLayout from '../../components/MainLayout';

const { Title } = Typography;
const { Column } = Table;

// Configura moment para usar el locale en español
moment.locale('es');

const formatDate = (dateStr) => {
  return moment(dateStr).format('D [de] MMMM [de] YYYY');
};

const formatCurrency = (value) => {
  const num = isNaN(value) ? 0 : value;
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(num);
};

export const CorteCajaComp = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [totalUtilidad, setTotalUtilidad] = useState(0);
  const [totalCaja, setTotalCaja] = useState(50000000);
  const [totalPrestamos, setTotalPrestamos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [initialCaja, setInitialCaja] = useState(50000000);

  const calculateTotals = (movimientos = [], prestamos = [], gastos = []) => {
    const totalAbonos = movimientos.reduce((acc, curr) => acc + parseFloat(curr.abono) + parseFloat(curr.interes || 0), 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
    const totalPrestamos = prestamos.reduce((acc, curr) => acc + parseFloat(curr.total), 0);

    const newTotalUtilidad = totalAbonos;
    const newTotalCaja = initialCaja + totalAbonos - totalGastos - totalPrestamos;

    setTotalUtilidad(newTotalUtilidad);
    setTotalCaja(newTotalCaja);
    setTotalGastos(totalGastos);
    setTotalPrestamos(totalPrestamos);
  };

  const fetchData = async () => {
    try {
      const [movimientosResponse, prestamosResponse, gastosResponse] = await Promise.all([
        axios.get('http://localhost:8080/movimientos'),
        axios.get('http://localhost:8080/montoPrestamos'),
        axios.get('http://localhost:8080/mostrarGasto')
      ]);

      const movimientosDatos = movimientosResponse.data.datos.map(dato => ({
        ...dato,
        fecha_pago: formatDate(dato.fecha_pago) // Formatea la fecha en español
      }));

      const prestamosDatos = prestamosResponse.data.Data.map(dato => ({
        ...dato,
        nombre: dato.nombre,
        abono: parseFloat(-dato.total),
        fecha_pago: dato.fecha // Formatea la fecha en español
      }));

      const gastosDatos = gastosResponse.data.Data.map(gasto => ({
        ...gasto,
        nombre: gasto.nombre,
        gasto: parseFloat(-gasto.monto),
        fecha_pago: gasto.fecha// Formatea la fecha en español
      }));

      setMovimientos(movimientosDatos);
      setPrestamos(prestamosDatos);
      setGastos(gastosDatos);
      calculateTotals(movimientosDatos, prestamosDatos, gastosDatos);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotals(movimientos, prestamos, gastos);
  }, [movimientos, prestamos, gastos]);

  const filterMovimientosByDate = () => {
    if (!fechaFiltro) return [...movimientos, ...prestamos, ...gastos];
  
    const combinedData = [...movimientos, ...prestamos, ...gastos];
    return combinedData.filter(item => {
      // Filtra por fecha en el formato "24 de julio de 2024"
      return item.fecha_pago.includes(fechaFiltro);
    });
  };

  const componentRef = useRef();

  return (
    <>
      <MainLayout>
        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
          <Col>
            <Title level={2}>Corte de Caja</Title>
          </Col>
          <Col>
            <Input 
              placeholder="Ingresa la fecha" 
              onChange={(e) => setFechaFiltro(e.target.value)} 
              style={{ width: '200px', marginRight: '10px' }} 
            />
            <Button type="primary" onClick={filterMovimientosByDate}>
              Filtrar
            </Button>
          </Col>
          <Col>
            <ReactToPrint
              trigger={() => <Button type="primary">Imprimir</Button>}
              content={() => componentRef.current}
            />
          </Col>
        </Row>
        <div ref={componentRef}>
          <Table dataSource={filterMovimientosByDate()} rowKey="id" pagination={false} bordered>
            <Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Column 
                 title="Abono" 
                 dataIndex="abono" 
                 key="abono"
                 render={abono => formatCurrency(abono)}
            />
            <Column 
              title="Fecha de Pago" 
              dataIndex="fecha_pago" 
              key="fecha_pago" 
            />
            <Column 
                  title="Saldo" 
                  dataIndex="saldo" 
                  key="saldo" 
                  render={saldo => formatCurrency(saldo)}
            />
            <Column 
                  title="Interes" 
                  dataIndex="interes" 
                  key="interes" 
                  render={interes => formatCurrency(interes)}
            />
            <Column 
                title="Gasto" 
                dataIndex="gasto" 
                key="gasto"
                render={gasto => formatCurrency(gasto)}
            />
            <Column 
                 title="Préstamo" 
                 dataIndex="total" 
                 key="total" 
                 render={total => formatCurrency(total)}
            />
          </Table>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Utilidad: {formatCurrency(totalUtilidad)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Préstamos: {formatCurrency(totalPrestamos)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Gastos: {formatCurrency(totalGastos)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Caja: {formatCurrency(totalCaja)}
          </Title>
        </div>
      </MainLayout>
    </>
  );
};
