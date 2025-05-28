import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReservaComponent } from './table-reserva.component';

describe('TableReservaComponent', () => {
  let component: TableReservaComponent;
  let fixture: ComponentFixture<TableReservaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableReservaComponent]
    });
    fixture = TestBed.createComponent(TableReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
