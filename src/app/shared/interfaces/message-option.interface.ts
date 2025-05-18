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

export interface MessageOptions2 {
  title?: string;
  message?: string;
  icon?: any;
  input?: any;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  showDenyButton?: boolean;
  actionOnConfirm?: () => void;
  actionOnCancel?: () => void;
  actionOnDeny?: () => void;
  denyButtonText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  denyButtonColor?: string;
}
