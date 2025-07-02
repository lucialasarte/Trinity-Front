import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametricasService } from '../../shared/services/parametricas.service';
import { Pais } from '../../usuarios/models/pais';
import { Rol } from '../../usuarios/models/rol';
import { TipoIdentificacion } from '../../usuarios/models/tipo-identificacion';
import { AuthService } from 'src/app/auth/auth.service';
import { mayorDeEdadValidator } from 'src/app/shared/models/validatorMayor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrls: [
    '../../usuarios/form-registrar-usuario/registrar-usuario.component.css',
  ],
})
export class RegistrarEmpleadoComponent implements OnInit {
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Input() correoPrellenado: string | null = null;
  @Input() empleadoData: any = null;

  form!: FormGroup;

  paises: Pais[] = [];
  roles: Rol[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];
  apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this._loadPaises();
    this._loadRoles();
    this._loadTiposIdentificacion();
    this._initForm();
    if (this.empleadoData) {
      this.form.patchValue(this.empleadoData);
      this.form.patchValue({
        pais: this.empleadoData.id_pais,
        tipo_identificacion: this.empleadoData.id_tipo_identificacion,
        roles: this.empleadoData.id_rol,
      });
    } else if (this.correoPrellenado) {
      this.form.patchValue({
        correo: this.correoPrellenado,
      });
    }
  }

  private _initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      tipo_identificacion: [null, Validators.required],
      numero_identificacion: ['', Validators.required],
      fecha_nacimiento: [null, [Validators.required, mayorDeEdadValidator]],
      pais: [null, Validators.required],
      roles: [[], Validators.required],
    });
    this.form.statusChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });
  }
  private _loadPaises(): void {
    this.parametricasService
      .get_paises()
      .subscribe((data) => (this.paises = data));
  }

  private _loadRoles(): void {
    this.parametricasService.get_roles().subscribe((data) => {
      this.roles = data;
    });
  }

  private _loadTiposIdentificacion(): void {
    this.parametricasService
      .get_tipos_identificacion()
      .subscribe((data) => (this.tiposIdentificacion = data));
  }
}
