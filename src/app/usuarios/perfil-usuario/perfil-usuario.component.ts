import { Component, computed, effect } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import Swal from 'sweetalert2';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent {
  // Signal computado que obtiene el usuario actual desde AuthService
  usuario = computed(() => this.auth.usuarioActual());
  form: FormGroup;
  imagenesDocIds: number[] = [];
  fotoPerfilUrl: SafeUrl | string | null = null;
  subiendoDoc = false;

  // Inyección del AuthService como público para acceso en plantilla
  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private usuariosService: UsuariosService
  ) {
    // Si no hay usuario cargado (por ejemplo, acceso directo por URL), intenta cargarlo desde el token
    if (!this.auth.usuarioActual()) {
      this.auth.cargarUsuarioDesdeToken();
    }
    this.form = this.fb.group({
      foto_perfil: [null]
    });
    // Efecto reactivo: cada vez que cambia el usuario, refresca las imágenes
    effect(() => {
      this.cargarImagenesUsuario();
    });
  }

  cargarImagenesUsuario() {
    const usuario = this.usuario();
    if (!usuario) return;

    // Foto de perfil
    if (usuario.id_imagen) {
      this.fotoPerfilUrl = `${environment.apiUrl}/imagenes/id/${usuario.id_imagen}`;
    } else if (usuario.imagen) {
      this.fotoPerfilUrl = `${environment.apiUrl}/${usuario.imagen}`;
    } else {
      this.fotoPerfilUrl = 'assets/anonimo.jpg';
    }

    // Documentos
    this.imagenesDocIds = Array.isArray(usuario.imagenes_doc)
      ? usuario.imagenes_doc.map((img: { id: number }) => img.id)
      : [];
  }

  // Función auxiliar para mostrar los roles como string
  mostrarRoles(user: any): string {
    if (!user) return '';
    if (Array.isArray(user.roles)) {
      return user.roles.map((r: any) => r.nombre).join(', ');
    }
    return user.rol?.nombre || '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.get('foto_perfil')?.setValue(file);
      // Vista previa instantánea
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPerfilUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitFotos() {
    const usuario = this.usuario();
    if (!this.form.valid || !usuario) return;
    const idUsuario = usuario.id;
    if (typeof idUsuario !== 'number') {
      Swal.fire({ icon: 'error', title: 'Usuario no válido', text: 'No se pudo identificar el usuario.' });
      return;
    }
    const fotoPerfil = this.form.get('foto_perfil')?.value;
    if (fotoPerfil) {
      const formData = new FormData();
      formData.append('foto_perfil', fotoPerfil);
      this.usuariosService.subirImagenDocumento(formData, idUsuario).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Foto de perfil actualizada', timer: 1200, showConfirmButton: false });
          this.auth.refrescarUsuarioActual();
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Error al subir foto de perfil', text: err?.error?.message || 'Intente nuevamente.' });
        }
      });
      this.form.reset();
    } else {
      Swal.fire({ icon: 'info', title: 'Seleccione una imagen para subir.' });
    }
  }

  onDeleteDoc(idImagen: number) {
    Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarImagenDoc(idImagen).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Documento eliminado', timer: 1200, showConfirmButton: false });
            this.auth.refrescarUsuarioActual();
          },
          error: (err) => {
            Swal.fire({ icon: 'error', title: 'Error al eliminar documento', text: err?.error?.message || 'Intente nuevamente.' });
          }
        });
      }
    });
  }

  getDocUrl(id: number): string {
    return `${environment.apiUrl}/usuarios/imagenDoc/${id}`;
  }

  /**
   * Maneja la carga reactiva y asincrónica de un documento adicional.
   * Muestra feedback visual y actualiza la UI en tiempo real.
   */
  onAddDoc(event: any) {
    const file = event.target.files[0];
    const idUsuario = this.usuario()?.id;
    if (!file || typeof idUsuario !== 'number') return;
    this.subiendoDoc = true;
    const formData = new FormData();
    formData.append('image', file);
    this.usuariosService.subirImagenDocAdicional(formData, idUsuario).subscribe({
      next: () => {
        this.subiendoDoc = false;
        Swal.fire({ icon: 'success', title: 'Documento subido', timer: 1200, showConfirmButton: false });
        this.auth.refrescarUsuarioActual();
      },
      error: (err) => {
        this.subiendoDoc = false;
        Swal.fire({ icon: 'error', title: 'Error al subir documento', text: err?.error?.message || 'Intente nuevamente.' });
      }
    });
  }

}
