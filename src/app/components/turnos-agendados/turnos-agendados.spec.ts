import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosAgendados } from './turnos-agendados';

describe('TurnosAgendados', () => {
  let component: TurnosAgendados;
  let fixture: ComponentFixture<TurnosAgendados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosAgendados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosAgendados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
