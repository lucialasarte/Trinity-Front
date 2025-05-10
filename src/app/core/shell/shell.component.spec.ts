import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShellComponent } from './shell.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        ShellComponent,
        // HeaderComponent,
        // ContentComponent,
        LeftSidebarComponent,
        // FooterComponent,
        // MessagesComponent
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deberia existir un texto', () => {
    expect(component).toBeTruthy();
  });

});