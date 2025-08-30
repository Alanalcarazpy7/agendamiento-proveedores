import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Turno from '../../../models/turno';
import Jaula from '../../../models/jaula';
import Producto from '../../../models/producto';
import Proveedor from '../../../models/proveedor';

@Component({
  selector: 'app-turnos-agendados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos-agendados.html',
  styleUrls: ['./turnos-agendados.css']
})
export class TurnosAgendados {
  turnos: Turno[] = [];
  jaulas: Jaula[] = [];
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  mostrarPopupDetalles: boolean = false;
  turnoDetalles?: Turno;

  fechaSeleccionada: string = '';
  turnoSeleccionado?: Turno;
  jaulaElegidaId?: number; // CAMBIO: debería ser string según tus datos

  constructor() {
    this.cargarTurnos();
    this.cargarJaulas();
    this.cargarProductos();
    this.cargarProveedores();
    this.actualizarEstructuraReservas(); // Actualizar datos existentes
  }

  // -------------------- LocalStorage --------------------
  cargarTurnos() {
    const data = localStorage.getItem('reservas');
    this.turnos = data ? JSON.parse(data) : [];
  }

  guardarTurnos() {
    localStorage.setItem('reservas', JSON.stringify(this.turnos));
  }

  cargarJaulas() {
    const data = localStorage.getItem('jaulas');
    this.jaulas = data ? JSON.parse(data) : [];
  }

  guardarJaulas() {
    localStorage.setItem('jaulas', JSON.stringify(this.jaulas));
  }

  cargarProductos() {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  cargarProveedores() {
    const data = localStorage.getItem('proveedores');
    this.proveedores = data ? JSON.parse(data) : [];
  }

  // -------------------- Actualizar estructura de datos --------------------
  actualizarEstructuraReservas() {
    let datosActualizados = false;
    
    this.turnos = this.turnos.map(turno => {
      // Agregar campos faltantes si no existen
      if (!turno.estado) {
        turno.estado = 'pendiente';
        datosActualizados = true;
      }
      if (!turno.hasOwnProperty('horaInicioRecepcion')) {
        (turno as any).horaInicioRecepcion = null;
        datosActualizados = true;
      }
      if (!turno.hasOwnProperty('horaFinRecepcion')) {
        (turno as any).horaFinRecepcion = null;
        datosActualizados = true;
      }
      
      // Actualizar detalles_res para incluir nombres de productos
      if (turno.detalles_res) {
        turno.detalles_res = turno.detalles_res.map((detalle: any) => {
          if (!detalle.nombre) {
            const producto = this.productos.find(p => p.idProducto == detalle.idProducto);
            detalle.nombre = producto ? producto.nombre : 'Producto no encontrado';
            datosActualizados = true;
          }
          return detalle;
        });
      }
      
      return turno;
    });
    
    if (datosActualizados) {
      this.guardarTurnos();
    }
  }

  // -------------------- Utilidades --------------------
  get turnosFiltrados() {
    if (!this.fechaSeleccionada) {
      return this.turnos.sort((a, b) =>
        a.horaInicioAgendamiento.localeCompare(b.horaInicioAgendamiento)
      );
    }

    return this.turnos
      .filter(t => t.fecha === this.fechaSeleccionada)
      .sort((a, b) => a.horaInicioAgendamiento.localeCompare(b.horaInicioAgendamiento));
  }

  get jaulasDisponibles() {
    return this.jaulas.filter(j => j.enUso === 'N');
  }

  getNombreProducto(idProducto: number): string {
    const p = this.productos.find(prod => prod.idProducto === idProducto);
    return p ? p.nombre : `Producto ${idProducto}`;
  }

  getNombreProveedor(idProveedor: number): string {
    const prov = this.proveedores.find(p => p.idProveedor === idProveedor);
    return prov ? prov.nombre : `Proveedor ${idProveedor}`;
  }

  getNombreJaula(turno: Turno): string {
    // CAMBIO: usar idJaula en lugar de jaulaId según tus datos
    if (!(turno as any).idJaula) return '-';
    const jaula = this.jaulas.find(j => j.idJaula == (turno as any).idJaula);
    return jaula ? jaula.nombre : '-';
  }

  // -------------------- Recepción --------------------
  iniciarRecepcion(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.jaulaElegidaId = undefined;
    console.log('Turno seleccionado:', turno); // Para debug
  }
confirmarInicioRecepcion() {
    console.log('Confirmando inicio...', this.turnoSeleccionado, this.jaulaElegidaId);
    
    if (!this.turnoSeleccionado || !this.jaulaElegidaId) {
      console.log('Faltan datos para confirmar');
      return;
    }

    // CORRECCIÓN: Convertir jaulaElegidaId a número para la comparación
    const jaula = this.jaulas.find(j => j.idJaula == Number(this.jaulaElegidaId));
    if (!jaula) {
      console.log('Jaula no encontrada', this.jaulaElegidaId);
      return;
    }

    // Marcar jaula como en uso
    jaula.enUso = 'S';

    // Buscar el turno en el array y actualizarlo
    const idx = this.turnos.findIndex(t => t.idTurno === this.turnoSeleccionado!.idTurno);
    if (idx !== -1) {
      (this.turnos[idx] as any).idJaula = jaula.idJaula;
      (this.turnos[idx] as any).horaInicioRecepcion = new Date().toTimeString().slice(0, 5);
      (this.turnos[idx] as any).estado = 'en recepcion';
    }

    // Guardar cambios
    this.guardarJaulas();
    this.guardarTurnos();

    // Limpiar selección
    this.turnoSeleccionado = undefined;
    this.jaulaElegidaId = undefined;
    
    console.log('Recepción iniciada correctamente');
  }

  finalizarRecepcion(turno: Turno) {
    if (!(turno as any).idJaula) return;

    const jaula = this.jaulas.find(j => j.idJaula == (turno as any).idJaula);
    if (!jaula) return;

    const idx = this.turnos.findIndex(t => t.idTurno === turno.idTurno);
    if (idx !== -1) {
      (this.turnos[idx] as any).horaFinRecepcion = new Date().toTimeString().slice(0, 5);
      (this.turnos[idx] as any).estado = 'completado';
      // Liberar la jaula
      (this.turnos[idx] as any).idJaula = null;
    }

    // Marcar jaula como disponible
    jaula.enUso = 'N';

    this.guardarTurnos();
    this.guardarJaulas();
  }



   verDetalles(turno: Turno) {
    this.turnoDetalles = turno;
    this.mostrarPopupDetalles = true;
    console.log('Mostrando detalles del turno:', turno); // Para debug
  }

  cerrarPopupDetalles() {
    this.mostrarPopupDetalles = false;
    this.turnoDetalles = undefined;
  }
}