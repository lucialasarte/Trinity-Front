import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function validarRangoFechas(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const [checkin, checkout] = control.value || [];

    if (!checkin || !checkout) return null;

    const inDate = new Date(checkin);
    const outDate = new Date(checkout);

    if (inDate.getTime() === outDate.getTime()) {
      return { fechasIguales: true };
    }

    if (outDate <= inDate) {
      return { checkOutAntesQueCheckIn: true };
    }

    return null;
  };
}
