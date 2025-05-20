import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LeftSidebarComponent } from './shell/left-sidebar/left-sidebar.component';
import { NzZorroModule } from '../shared/nz-zorro.module';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    NzZorroModule // Importa el módulo compartido de ng-zorro
  ],
  declarations: [
    ShellComponent,
    LeftSidebarComponent,

  ],
  providers: [],
  exports: [
    ShellComponent
  ],
  bootstrap: [],
})
export class CoreModule {}
