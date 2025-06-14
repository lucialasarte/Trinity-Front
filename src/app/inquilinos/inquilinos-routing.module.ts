import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { InquilinosComponent } from "./inquilinos.component";

const routes: Routes = [
    {path: '', component: InquilinosComponent},
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InquilinosRoutingModule { }