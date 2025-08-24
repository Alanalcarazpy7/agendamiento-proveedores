
export default interface Recepcion {
  idTurno: number;
  fecha: Date;
  horaInicioAgendamiento: Date;
  horaFinAgendamiento: Date;
  idProveedor: number;
  idJaula: number;
  horaInicioRecepcion: Date;
  horaFinRecepcion: Date;
}

export interface recepciondetalle {
  idProducto: number;
  cantidad: number;
}

