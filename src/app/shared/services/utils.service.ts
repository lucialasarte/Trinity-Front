import {  Injectable } from "@angular/core";

import Swal from "sweetalert2";
import { MessageOptions } from "../interfaces/message-option.interface";



@Injectable({
  providedIn: "root",
})
export class UtilsService {
  readonly BUTTON_TEXT_ACEPTAR = "Aceptar";
  readonly BUTTON_TEXT_CANCELAR = "Cancelar";

  constructor() {}

  showMessage(options: MessageOptions = {}): void {
    Swal.fire({
      title: options.title,
      html: options.message,
      icon: options.icon || "error",
      showConfirmButton: options.showConfirmButton ?? false,
      showCancelButton: options.showCancelButton ?? false,
      confirmButtonText: options.confirmButtonText || this.BUTTON_TEXT_ACEPTAR,
      confirmButtonColor: options.confirmButtonColor || "#0078CF",
      cancelButtonText: options.cancelButtonText ||this.BUTTON_TEXT_CANCELAR,
      reverseButtons: true,
      allowOutsideClick: false,
      input: options.input || undefined,
      timer: 3000,
    }).then((result) => {
      if (result?.isConfirmed) {
        if (options.actionOnConfirm) options.actionOnConfirm();
      } else if (result?.dismiss === Swal.DismissReason.cancel) {
        if (options.actionOnCancel) options.actionOnCancel();
      }
    });
  }
  showMessage2(options: MessageOptions = {}): void {
  Swal.fire({
    title: options.title,
    html: options.message,
    icon: options.icon || "error",
    showConfirmButton: options.showConfirmButton ?? false,
    showCancelButton: options.showCancelButton ?? false,
    confirmButtonText: options.confirmButtonText || this.BUTTON_TEXT_ACEPTAR,
    confirmButtonColor: options.confirmButtonColor || "#0078CF",
    cancelButtonText: options.cancelButtonText || this.BUTTON_TEXT_CANCELAR,
    reverseButtons: true,
    allowOutsideClick: false,
    input: options.input || undefined,
  }).then((result) => {
    if (result?.isConfirmed && options.actionOnConfirm) {
      options.actionOnConfirm();
    } else if (result?.dismiss === Swal.DismissReason.cancel && options.actionOnCancel) {
      options.actionOnCancel();
    }
  });
}


  showSuccessAlert(
    title?: any,
    message?: any,
    html?: any,
    showButtonConfirm?: any,
    showButtonCancel?: any,
    timer?: any
  ) {
    Swal.fire({
      icon: "success",
      title: title,
      html: html,
      text: message,
      showConfirmButton: showButtonConfirm,
      showCancelButton: showButtonCancel,
      timer: 2000,
    });
  }

  showErrorAlert(
    title?: any,
    message?: any,
    html?: any,
    showButtonConfirm?: any,
    showButtonCancel?: any,
    timer?: any
  ) {
    Swal.fire({
      icon: "error",
      title: title,
      html: html,
      text: message,
      showConfirmButton: showButtonConfirm,
      showCancelButton: showButtonCancel,
      timer: 2000,
    });
  }

  showWarningAlert(
    title?: any,
    message?: any,
    html?: any,
    showButtonConfirm?: any,
    showButtonCancel?: any,
    confirmButtonText?: any,
    cancelButtonText?: any,
    confirmButtonColor?: any,
    cancelButtonColor?: any
  ) {
    Swal.fire({
      icon: "warning",
      title: title,
      html: html,
      text: message,
      showConfirmButton: showButtonConfirm,
      showCancelButton: showButtonCancel,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: cancelButtonColor,
      timer: 3000,
    });
  }

}