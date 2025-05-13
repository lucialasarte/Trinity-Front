import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ShellComponent } from './core/shell/shell.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzZorroModule } from './shared/nz-zorro.module';

registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzZorroModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [ShellComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class AppModule { }
