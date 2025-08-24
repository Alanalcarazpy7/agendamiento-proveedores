import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Jaula from '../../../models/jaula';

@Component({
  selector: 'app-jaulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jaulas.html',
  styleUrls: ['./jaulas.css']
})
export class Jaulas {
  jaulas: Jaula[] = [];
  filtroNombre: string = '';

  nuevaJaula: Jaula = { idJaula: 0, nombre: '', enUso: 'N' };

  editandoId: number | null = null;
  nombreEditado: string = '';
  enUsoEditado: 'S' | 'N' = 'N';

  constructor() {
    this.cargarJaulas();
  }

  // Cargar desde localStorage
  cargarJaulas() {
    const data = localStorage.getItem('jaulas');
    this.jaulas = data ? JSON.parse(data) : [];
  }

  // Guardar en localStorage
  guardarJaulas() {
    localStorage.setItem('jaulas', JSON.stringify(this.jaulas));
  }

  get jaulasFiltradas(): Jaula[] {
    return this.jaulas.filter(j =>
      j.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  agregar() {
    if (!this.nuevaJaula.nombre.trim()) return;

    const nuevo: Jaula = {
      idJaula: this.jaulas.length > 0 ? this.jaulas[this.jaulas.length - 1].idJaula + 1 : 1,
      nombre: this.nuevaJaula.nombre,
      enUso: this.nuevaJaula.enUso
    };

    this.jaulas.push(nuevo);
    this.guardarJaulas();

    // Reset del formulario
    this.nuevaJaula = { idJaula: 0, nombre: '', enUso: 'N' };
  }

  eliminar(id: number) {
    this.jaulas = this.jaulas.filter(j => j.idJaula !== id);
    this.guardarJaulas();
  }

  cambiarEstado(jaula: Jaula) {
    const index = this.jaulas.findIndex(j => j.idJaula === jaula.idJaula);
    if (index >= 0) {
      this.jaulas[index].enUso = this.jaulas[index].enUso === 'S' ? 'N' : 'S';
      this.guardarJaulas();
    }
  }

  iniciarEdicion(jaula: Jaula) {
    this.editandoId = jaula.idJaula;
    this.nombreEditado = jaula.nombre;
    this.enUsoEditado = jaula.enUso;
  }

  guardarEdicion(id: number) {
    const jaula = this.jaulas.find(j => j.idJaula === id);
    if (jaula) {
      jaula.nombre = this.nombreEditado;
      jaula.enUso = this.enUsoEditado;
      this.guardarJaulas();
    }
    this.cancelarEdicion();
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nombreEditado = '';
  }
}
