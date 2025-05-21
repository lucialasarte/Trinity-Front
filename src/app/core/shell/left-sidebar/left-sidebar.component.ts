import { Component, Input, computed } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'trinity-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  @Input() isEnglish: boolean = false;
  constructor(public auth: AuthService) {}

  // Signal computado que obtiene el usuario actual desde AuthService
  usuario = computed(() => this.auth.usuarioActual);
}
