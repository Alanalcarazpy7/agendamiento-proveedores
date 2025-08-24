import { Routes } from '@angular/router';


import { Proveedores } from './components/proveedores/proveedores';
import { Productos } from './components/productos/productos';
import { Jaulas } from './components/jaulas/jaulas';
import { Reserva } from './components/reservas/reservas';
import { TurnosAgendados } from './components/turnos-agendados/turnos-agendados';

export const routes: Routes = [
  { path: 'proveedores', component: Proveedores },
  { path: 'productos', component: Productos },
  { path: 'jaulas', component: Jaulas },
  { path: 'reservas', component: Reserva },
  { path: 'turnos-agendados', component: TurnosAgendados },
  { path: '', redirectTo: 'proveedores', pathMatch: 'full' }
];
