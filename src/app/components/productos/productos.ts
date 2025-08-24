import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import Producto from '../../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
  productos: Producto[] = [];
  searchTerm: string = '';
  nuevoProducto: string = '';
  editando: number | null = null;
  nombreEditado: string = '';

  constructor() {
    this.cargarProductos();
  }

  cargarProductos() {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  get productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  agregarProducto() {
    if (!this.nuevoProducto.trim()) return;

    const nuevo: Producto = {
      idProducto: this.productos.length > 0 ? this.productos[this.productos.length - 1].idProducto + 1 : 1,
      nombre: this.nuevoProducto,
      cantidad: 0   // lo dejamos inicializado, aunque no se usa acá
    };

    this.productos.push(nuevo);
    this.guardarProductos();
    this.nuevoProducto = '';
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.idProducto !== id);
    this.guardarProductos();
  }

  iniciarEdicion(producto: Producto) {
    this.editando = producto.idProducto;
    this.nombreEditado = producto.nombre;
  }

  guardarEdicion(id: number) {
    const producto = this.productos.find(p => p.idProducto === id);
    if (producto) {
      producto.nombre = this.nombreEditado;
      this.guardarProductos();
    }
    this.editando = null;
    this.nombreEditado = '';
  }

  cancelarEdicion() {
    this.editando = null;
    this.nombreEditado = '';
  }
}
