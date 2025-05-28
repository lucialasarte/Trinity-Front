import { AbstractControl, ValidationErrors } from "@angular/forms";

export function mayorDeEdadValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const fechaNacimiento = new Date(valor);

  // Verificar si es una fecha válida
  if (isNaN(fechaNacimiento.getTime())) {
    return { invalidDate: true };
  }

  // Rango de años razonables
  const anio = fechaNacimiento.getFullYear();
  if (anio < 1900 || anio > 2100) {
    return { invalidDate: true };
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  const dia = hoy.getDate() - fechaNacimiento.getDate();

  if (mes < 0 || (mes === 0 && dia < 0)) {
    edad--;
  }

  if (edad < 18) {
    return { menorDeEdad: true };
  }

  return null;
}
