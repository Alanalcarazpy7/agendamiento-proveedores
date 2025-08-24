import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Turno from '../../../models/turno';
import Jaula from '../../../models/jaula';
import Producto from '../../../models/producto';

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
  fechaSeleccionada: string = '';
  turnoSeleccionado?: Turno;
  jaulaElegidaId?: number;
  productos: Producto[] = [];

  cargarProductos() {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  constructor() {
    this.cargarTurnos();
    this.cargarJaulas();
    this.cargarProductos(); // <- ahora también cargamos productos
  }
  getNombreProducto(idProducto: number): string {
    const p = this.productos.find(prod => prod.idProducto === idProducto);
    return p ? p.nombre : `Producto ${idProducto}`;
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

  // -------------------- Filtrado por fecha --------------------
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

  // Jaulas libres
  get jaulasDisponibles() {
    return this.jaulas.filter(j => j.enUso === 'N');
  }

  // -------------------- Recepción --------------------
  iniciarRecepcion(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.jaulaElegidaId = undefined; // reset al iniciar
  }

  confirmarInicioRecepcion() {
    if (!this.turnoSeleccionado || !this.jaulaElegidaId) return;

    const jaula = this.jaulas.find(j => j.idJaula === this.jaulaElegidaId);
    if (!jaula) return;

    jaula.enUso = 'S';
    this.turnoSeleccionado.jaulaId = jaula.idJaula;
    this.turnoSeleccionado.horaInicioRecepcion = new Date().toLocaleTimeString();

    this.guardarJaulas();
    this.guardarTurnos();

    this.turnoSeleccionado = undefined;
  }

  finalizarRecepcion(turno: Turno) {
    if (!turno.jaulaId) return;

    const jaula = this.jaulas.find(j => j.idJaula === turno.jaulaId);
    if (!jaula) return;

    turno.horaFinRecepcion = new Date().toLocaleTimeString();
    jaula.enUso = 'N';
    turno.jaulaId = undefined;

    this.guardarTurnos();
    this.guardarJaulas();
  }
  getNombreJaula(turno: Turno): string {
    if (!turno.jaulaId) return '-';
    const jaula = this.jaulas.find(j => j.idJaula === turno.jaulaId);
    return jaula ? jaula.nombre : '-';
  }
}

