import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SolicitudesPendientes } from './SolicitudesPendientes';

export const Solicitudes= ()=>{
    return(
        <>
         <NavBar/>
         <SideBar />
         <SolicitudesPendientes />
        </>
    )
}
