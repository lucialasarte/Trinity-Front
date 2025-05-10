import {Component} from '@angular/core';

/**
 * Muestra la pantalla de "not found" en caso de que la ruta requerida no exista.
 */
@Component({
  selector: 'trinity-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  goBack(){
    window.history.back();
  }
}
