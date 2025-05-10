import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ShellComponent } from './core/shell/shell.component';

@NgModule({
  declarations: [ ],
  imports: [
    BrowserModule,
    CoreModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [ShellComponent]
})
export class AppModule { }
