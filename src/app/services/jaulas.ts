import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Jaula from '../../models/jaula';

@Injectable({
  providedIn: 'root'
})
export class JaulasService {
  private jaulas: Jaula[] = [
    { idJaula: 1, nombre: 'Jaula A', enUso: 'S' },
    { idJaula: 2, nombre: 'Jaula B', enUso: 'N' }
  ];

  private jaulasSubject = new BehaviorSubject<Jaula[]>(this.jaulas);

  getJaulas(): Observable<Jaula[]> {
    return this.jaulasSubject.asObservable();
  }

  addJaula(jaula: Jaula) {
    this.jaulas.push({ ...jaula, idJaula: this.jaulas.length + 1 });
    this.jaulasSubject.next(this.jaulas);
  }

  updateJaula(updated: Jaula) {
    const index = this.jaulas.findIndex(j => j.idJaula === updated.idJaula);
    if (index !== -1) {
      this.jaulas[index] = updated;
      this.jaulasSubject.next(this.jaulas);
    }
  }

  deleteJaula(id: number) {
    this.jaulas = this.jaulas.filter(j => j.idJaula !== id);
    this.jaulasSubject.next(this.jaulas);
  }
}
