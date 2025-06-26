
import { RegistrarseComponent } from "./registrarse.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { NzZorroModule } from "src/app/shared/nz-zorro.module";
import { RegistrarseRoutingModule } from "./registarse-routing.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzZorroModule,
    NgxMaskDirective,
    NgxMaskPipe,
    RegistrarseRoutingModule,
  ],
  declarations: [
    RegistrarseComponent
  ]
})
export class RegistrarseModule {}
