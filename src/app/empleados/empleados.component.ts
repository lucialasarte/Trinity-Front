import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios/models/usuario';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { EmpleadosService } from './services/empleados.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent implements OnInit {
  empleados: any[] = [];
  cargando: boolean = true;

  constructor(
    private empleadosService: EmpleadosService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this._getEmpleados();
  }

  private _getEmpleados() {
    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        console.log(data);
        this.empleados = data;
        this.cargando = false;
      },
      error: (error) => {
        this.utilsService.showMessage ({
          title: 'Error al obtener empleados',
          icon: 'error',
          message: error.error.error || 'No se pudo obtener los empleados.'
        })
        this.cargando = false;
      },
    });
  }
}
