import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [ HomeComponent],
  imports: [
    CommonModule,
    NzZorroModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
