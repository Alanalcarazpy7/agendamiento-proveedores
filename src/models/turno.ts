
export default interface turno {
  idTurno: number;
  fecha: string;                       // YYYY-MM-DD
  horaInicioAgendamiento: string;      // HH:mm
  horaFinAgendamiento: string;         // HH:mm
  idProveedor: number;
  jaulaId?: number;                    // Jaula asignada durante recepción
  horaInicioRecepcion?: string;        // HH:mm
  horaFinRecepcion?: string;           // HH:mm
  estado:string;
  detalles_res: { idProducto: number; cantidad: number; nombre: string }[];
}

