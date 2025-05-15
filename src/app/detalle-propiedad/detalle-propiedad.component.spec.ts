import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePropiedadComponent } from './detalle-propiedad.component';

describe('DetallePropiedadComponent', () => {
  let component: DetallePropiedadComponent;
  let fixture: ComponentFixture<DetallePropiedadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePropiedadComponent]
    });
    fixture = TestBed.createComponent(DetallePropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
