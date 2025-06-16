import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleChatComponent } from './detalle-chat.component';

describe('DetalleChatComponent', () => {
  let component: DetalleChatComponent;
  let fixture: ComponentFixture<DetalleChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleChatComponent]
    });
    fixture = TestBed.createComponent(DetalleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
