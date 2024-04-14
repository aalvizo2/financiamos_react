import './App.css';
import './components/css/home.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Inicio from './pages/Inicio'
import { Registro } from './pages/Registro';
import Pendientes from './pages/Pendientes';
import Credito from './pages/Credito';
import Indicador from './pages/Indicador';
import Clientes from './pages/Clientes'
import DatosLaborales from './pages/DatosLaborales'
import Documentos from './pages/Documentos'
import { VistaPreviaDoc } from './pages/VistaPreviaDoc';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/inicio' element={<Inicio/>} />
                <Route path='/registro' element={<Registro/>}/>
                <Route path='/pendientes' element={<Pendientes/>}/>
                <Route path='/credito' element={<Credito />}/>
                <Route path='/indicador' element={<Indicador />}/>
                <Route path='/clientes' element={<Clientes />}/>
                <Route path='/datos_laborales' element={<DatosLaborales/>} />
                <Route path='/documentos' element={<Documentos />} />
                <Route path='/vista_previa' element={<VistaPreviaDoc />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;