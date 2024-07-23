import './App.css';
import './components/css/home.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import { Registro } from './pages/Registro';
import Pendientes from './pages/Pendientes';
import Credito from './pages/Credito';
import Indicador from './pages/Indicador';
import Clientes from './pages/Clientes';
import DatosLaborales from './pages/DatosLaborales';
import Documentos from './pages/Documentos';
import { VistaPreviaDoc } from './pages/VistaPreviaDoc';
import { SolicitudPrestamo } from './pages/SolicitudPrestamo';
import { VistaPreviaPrestamoFront } from './pages/VistaPreviaPrestamoFront';
import { Pagos } from './pages/Pagos';
import { Solicitudes } from './pages/Solicitudes/Solicitudes';
import Cliente from './pages/Solicitudes/Cliente'; // Import default, no destructuring
import { Movimientos } from './pages/Movimientos/Movimientos';
import { CorteCaja } from './pages/CorteCaja/CorteCaja';
import Profile from './pages/Profile/Profile';
import {Referencias } from './components/Referencias';
import Cobranza from './pages/Cobranza/Cobranza';
import { Gasto } from './pages/Gastos/Gasto';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/pendientes" element={<Pendientes />} />
                <Route path="/credito" element={<Credito />} />
                <Route path="/indicador" element={<Indicador />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/datos_laborales" element={<DatosLaborales />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/vista_previa" element={<VistaPreviaDoc />} />
                <Route path="/solicitud" element={<SolicitudPrestamo />} />
                <Route path="/vista_previacredito" element={<VistaPreviaPrestamoFront />} />
                <Route path="/solicitudes" element={<Solicitudes />} />
                <Route path="/pagar" element={<Pagos />} />
                <Route path="/cliente/:cliente" element={<Cliente />} /> 
                <Route path='/movimientos' element={<Movimientos />}/>
                <Route path='/corteCaja' element={<CorteCaja/>}/>
                <Route path='/profile' element={<Profile />} />
                <Route path='/referencias' element={<Referencias />} />
                <Route path='/cobranza' element={<Cobranza />} />
                <Route path='/gastos' element={<Gasto />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
