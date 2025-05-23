import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarEmpleadoComponent } from './reservar-empleado.component';

describe('ReservarEmpleadoComponent', () => {
  let component: ReservarEmpleadoComponent;
  let fixture: ComponentFixture<ReservarEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservarEmpleadoComponent]
    });
    fixture = TestBed.createComponent(ReservarEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
