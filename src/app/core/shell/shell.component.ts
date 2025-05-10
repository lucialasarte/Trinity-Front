import { Component } from '@angular/core';

/**
 * Define la estuctura o maqueta del sitio. definiendo un orden entre los componentes principales del template.
 */
@Component({
  selector: 'trinity-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  isEnglish: boolean = false;
  toggleLanguage() {
    this.isEnglish = !this.isEnglish;
  }
}
