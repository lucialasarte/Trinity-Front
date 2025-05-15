import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { ShellComponent } from './core/shell/shell.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzZorroModule } from './shared/nz-zorro.module';
import { CoreRoutingModule } from './core/core-routing.module';
import { EmpleadosComponent } from './empleados/empleados.component';

registerLocaleData(en);

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzZorroModule,
    CoreRoutingModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [ShellComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class AppModule { }
