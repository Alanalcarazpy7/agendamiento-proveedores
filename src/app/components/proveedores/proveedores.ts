import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import Proveedor from '../../../models/proveedor';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores {
  proveedores: Proveedor[] = [];
  searchTerm: string = '';
  nuevoProveedor: string = '';
  editando: number | null = null;
  nombreEditado: string = '';

  constructor() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    const data = localStorage.getItem('proveedores');
    this.proveedores = data ? JSON.parse(data) : [];
  }

  guardarProveedores() {
    localStorage.setItem('proveedores', JSON.stringify(this.proveedores));
  }

  get proveedoresFiltrados() {
    return this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  agregarProveedor() {
    if (!this.nuevoProveedor.trim()) return;

    const nuevo: Proveedor = {
      idProveedor: this.proveedores.length > 0 ? this.proveedores[this.proveedores.length - 1].idProveedor + 1 : 1,
      nombre: this.nuevoProveedor
    };

    this.proveedores.push(nuevo);
    this.guardarProveedores();
    this.nuevoProveedor = '';
  }

  eliminarProveedor(id: number) {
    this.proveedores = this.proveedores.filter(p => p.idProveedor !== id);
    this.guardarProveedores();
  }

  iniciarEdicion(proveedor: Proveedor) {
    this.editando = proveedor.idProveedor;
    this.nombreEditado = proveedor.nombre;
  }

  guardarEdicion(id: number) {
    const proveedor = this.proveedores.find(p => p.idProveedor === id);
    if (proveedor) {
      proveedor.nombre = this.nombreEditado;
      this.guardarProveedores();
    }
    this.editando = null;
    this.nombreEditado = '';
  }

  cancelarEdicion() {
    this.editando = null;
    this.nombreEditado = '';
  }
}
