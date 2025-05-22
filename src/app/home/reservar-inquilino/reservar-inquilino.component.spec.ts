import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservarInquilinoComponent } from './reservar-inquilino/reservar-inquilino.component';

describe('ReservarInquilinoComponent', () => {
  let component: ReservarInquilinoComponent;
  let fixture: ComponentFixture<ReservarInquilinoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservarInquilinoComponent]
    });
    fixture = TestBed.createComponent(ReservarInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
