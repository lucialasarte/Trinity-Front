import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms"
import { NzZorroModule } from "src/app/shared/nz-zorro.module"
import { PropiedadesRoutingModule } from "../propiedades-routing.module"
import { NgModule } from "@angular/core"

@NgModule ({
    declarations: [],
    imports: [
        CommonModule,
        PropiedadesRoutingModule,
        NzZorroModule,
        ReactiveFormsModule
    ],
    exports: [],
})

export class FormPropiedadesModule { }