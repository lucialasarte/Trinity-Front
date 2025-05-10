import { Component, Input } from '@angular/core';

@Component({
  selector: 'trinity-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  @Input() isEnglish: boolean = false;
}
