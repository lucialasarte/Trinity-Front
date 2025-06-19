import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fechaNoVencidaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value;
  if (!valor) return null;

  // Asegurarse de que tenga el formato correcto
  const regex = /^\d{2}\/\d{2}$/;
  if (!regex.test(valor)) {
    return { invalidDate: true };
  }

  const [mesStr, anioStr] = valor.split('/');
  const mes = Number(mesStr);
  const anio = Number(anioStr);

  if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
    return { invalidDate: true };
  }

  const anioCompleto = 2000 + anio;
  const fechaIngresada = new Date(anioCompleto, mes); // primer día del mes siguiente
  const hoy = new Date();
  const fechaActual = new Date(hoy.getFullYear(), hoy.getMonth() + 1); // próximo mes

  if (fechaIngresada < fechaActual) {
    return { vencida: true };
  }

  return null;
}}