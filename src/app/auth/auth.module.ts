import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { NzZorroModule } from '../shared/nz-zorro.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NzZorroModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class AuthModule {}
