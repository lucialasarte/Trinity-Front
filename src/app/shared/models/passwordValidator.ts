import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null; // No valida si está vacío (para que se combine con el validador "required")

  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  const isValid = hasMinLength && hasUpperCase && hasNumber;

  return isValid
    ? null
    : { invalidPassword: true };
}
