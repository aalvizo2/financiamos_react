import React, { useState } from 'react';
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
  const [dates, setDates] = useState([null, null]);
  const [total, setTotal] = useState(0);

  const fetchMovimientos = async () => {
    if (dates[0] && dates[1]) {
      try {
        const response = await axios.get('http://localhost:8080/movimientos', {
          params: {
            startDate: dates[0].format('YYYY-MM-DD'),
            endDate: dates[1].format('YYYY-MM-DD')
          }
        });
        const datos = response.data.datos;
        setMovimientos(datos);
        const totalAbonos = datos.reduce((acc, curr) => acc + parseFloat(curr.abono), 0);
        setTotal(totalAbonos);
      } catch (error) {
        console.error('Error al obtener movimientos:', error);
      }
    } else {
      console.warn('Por favor selecciona un rango de fechas válido.');
    }
  };

  const componentRef = React.useRef();

  return (
  <>
        <MainLayout>

<Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={2}>Corte de Caja</Title>
        </Col>
        <Col>
          <RangePicker onChange={(dates) => setDates(dates)} />
          <Button type="primary" onClick={fetchMovimientos} style={{ marginLeft: '10px' }}>
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
        <Table dataSource={movimientos} rowKey="id" pagination={false} bordered>
          <Column title="Nombre" dataIndex="nombre" key="nombre" />
          <Column title="Abono" dataIndex="abono" key="abono" />
          <Column title="Fecha de Pago" dataIndex="fecha_pago" key="fecha_pago" render={fecha_pago => moment(fecha_pago).format('DD [de] MMMM [de] YYYY')} />
          <Column title="Saldo" dataIndex="saldo" key="saldo" />
        </Table>
        <Title level={4} style={{ marginTop: '20px', textAlign: 'right' }}>
          Total del Día: {total.toFixed(2)}
        </Title>
      </div>
    </MainLayout>
  </>

)
};
