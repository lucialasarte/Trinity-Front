import { Component, computed } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, RequiredValidator, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { min } from 'moment';

@Component({
  selector: 'app-inquilinos',
  templateUrl: './inquilinos.component.html',
  styleUrls: ['./inquilinos.component.css']
})
export class InquilinosComponent {

  form!:FormGroup;
  cargando: boolean = true;
  inquilinos: Array<any> = [];
  inquilinosFiltrados: Array<any> = [];
  isVisible: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UsuariosService
  ) { }

  ngOnInit(): void {
    this._getInquilinos();
  }
  
  cambiarEstadoInquilino(inquilino: any) {}
  buscarInquilinos(dato: string) {
    this.inquilinosFiltrados = this.inquilinos.filter(inquilino =>
      inquilino.nombre.toLowerCase().includes(dato.toLowerCase())
    );
    console.log('Filtrados:', this.inquilinosFiltrados);
  }
  showModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }

  onSubmitInquilino(){}

  private _getInquilinos() {
    this.userService.getUsuariosPorRol(2).subscribe({
      next: (data) => {
        this.inquilinos = data;
        this.inquilinosFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error fetching inquilinos:', error);
        this.cargando = false;
      }
    });
  }

  private _initForm() {
    this.form = this.fb.group({
      dato:[null,[Validators.required,MinLengthValidator]],
    });
  }

}
