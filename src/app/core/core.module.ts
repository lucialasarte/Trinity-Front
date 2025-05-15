import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LeftSidebarComponent } from './shell/left-sidebar/left-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule
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
