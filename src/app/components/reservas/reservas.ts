import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import Producto from '../../../models/producto';
import Jaula from '../../../models/jaula';
import Proveedor from '../../../models/proveedor';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- aquí está la clave
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css'],
})
export class Reserva {
  reservaForm: FormGroup;
  productos: Producto[] = [];
  proveedores: Proveedor[]=[]
  jaulas: Jaula[] = [];
  horasDisponibles: string[] = [
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ];

  constructor(private fb: FormBuilder) {
    this.cargarProductos();
    this.cargarProveedores()
    this.cargarJaulas();
    this.reservaForm = this.fb.group({
      fecha: ['', Validators.required],
      horaInicioAgendamiento: ['', Validators.required],
      horaFinAgendamiento: ['', Validators.required],
      idProveedor: [1, Validators.required],
      idJaula: [0, Validators.required],
      detalles_res: this.fb.array([]),
    });
  }

  get detalles_res(): FormArray {
    return this.reservaForm.get('detalles_res') as FormArray;
  }
  cargarProveedores() {
    const data = localStorage.getItem('proveedores');
    this.proveedores = data ? JSON.parse(data) : [];
  }

  agregarDetalle() {
    const detalle = this.fb.group({
      idProducto: [
        this.productos.length ? this.productos[0].idProducto : 0,
        Validators.required,
      ],
      cantidad: [1, Validators.required],
    });
    this.detalles_res.push(detalle);
  }

  eliminarDetalle(index: number) {
    this.detalles_res.removeAt(index);
  }

  onSubmit() {
    if (this.reservaForm.invalid) return;

    // convertir FormArray a array de objetos simples
    const detalles = this.detalles_res.controls.map((detalle) => detalle.value);

    const turnos = JSON.parse(localStorage.getItem('reservas') || '[]');
    const nuevaReserva = {
      idTurno: turnos.length ? turnos[turnos.length - 1].idTurno + 1 : 1,
      fecha: this.reservaForm.value.fecha,
      horaInicioAgendamiento: this.reservaForm.value.horaInicioAgendamiento,
      horaFinAgendamiento: this.reservaForm.value.horaFinAgendamiento,
      idProveedor: this.reservaForm.value.idProveedor,
      idJaula: this.reservaForm.value.idJaula,
      detalles_res: detalles, // <--- aquí se guardan todos los productos
    };
    console.log('nuevaReserva.idProveedor', nuevaReserva.idProveedor);

    turnos.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(turnos));

    // resetear el form
    this.reservaForm.reset({
      fecha: '',
      horaInicioAgendamiento: '07:00',
      horaFinAgendamiento: '07:30',
      idProveedor: 1,
      idJaula: 0,
    });

    // limpiar el FormArray
    this.detalles_res.clear();
  }

  cargarProductos() {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  cargarJaulas() {
    const data = localStorage.getItem('jaulas');
    this.jaulas = data ? JSON.parse(data) : [];
  }
}
