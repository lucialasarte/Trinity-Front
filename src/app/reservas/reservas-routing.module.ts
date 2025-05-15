import { NgModule } from '@angular/core';
import { ReservasComponent } from './reservas.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path: '', component: ReservasComponent},
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservasRoutingModule { }
