import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import 'bootstrap/dist/css/bootstrap.min.css';
import { SolicitudesPendientes } from './SolicitudesPendientes';

export const Solicitudes= ()=>{
    return(
        <>
         
         <SolicitudesPendientes />
        </>
    )
}
