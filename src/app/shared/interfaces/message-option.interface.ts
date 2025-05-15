export interface MessageOptions {
  title?: string;
  message?: string;
  icon?: any;
  input?: any;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  actionOnConfirm?: () => void;
  actionOnCancel?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
}
