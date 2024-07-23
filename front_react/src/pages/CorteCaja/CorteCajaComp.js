import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, DatePicker, Button, Typography, Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import ReactToPrint from 'react-to-print';
import MainLayout from '../../components/MainLayout';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Column } = Table;

export const CorteCajaComp = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [dates, setDates] = useState([moment().startOf('day'), moment().endOf('day')]);
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
        fecha_pago: moment(dato.fecha_pago, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD')
      }));
      console.log(movimientosResponse.data)
      const prestamosDatos = prestamosResponse.data.Data.map(dato => ({
        ...dato,
        nombre: dato.nombre,
        abono: parseFloat(-dato.total),
        fecha_pago: moment(dato.fecha, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD')
      }));
      console.log(prestamosDatos.data)
      const gastosDatos = gastosResponse.data.Data.map(gasto => ({
        ...gasto,
        nombre: gasto.nombre,
        gasto: parseFloat(-gasto.monto),
        fecha_pago: moment(gasto.fecha, 'DD [de] MMMM [de] YYYY').format('YYYY-MM-DD')
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

  const filterMovimientosByDate = (date) => {
    if (!date) return [...movimientos, ...prestamos, ...gastos];
  
    const combinedData = [...movimientos, ...prestamos, ...gastos];
    return combinedData.filter(item => {
      const fechaMovimiento = moment(item.fecha_pago, 'YYYY-MM-DD');
      return fechaMovimiento.isSame(date.startOf('day'), 'day');
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
            <RangePicker 
              onChange={(dates) => setDates(dates)} 
              defaultValue={[moment().startOf('day'), moment().endOf('day')]}
            />
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={filterMovimientosByDate}>
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
            <Column title="Abono" dataIndex="abono" key="abono" />
            <Column 
              title="Fecha de Pago" 
              dataIndex="fecha_pago" 
              key="fecha_pago" 
              render={fecha_pago => moment(fecha_pago).format('YYYY-MM-DD')}
            />
            <Column title="Saldo" dataIndex="saldo" key="saldo" />
            <Column title="Interes" dataIndex="interes" key="interes" />
            <Column title="Gasto" dataIndex="gasto" key="gasto" />
            <Column title="Préstamo" dataIndex="total" key="total" />
          </Table>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Utilidad: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalUtilidad)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Préstamos: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPrestamos)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Gastos: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalGastos)}
          </Title>
          <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
            Total de Caja: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalCaja)}
          </Title>
        </div>
      </MainLayout>
    </>
  );
};
