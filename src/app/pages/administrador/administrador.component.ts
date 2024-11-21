import { Component, ViewEncapsulation } from '@angular/core';
import { GestionDentistasComponent } from '../gestion-dentistas/gestion-dentistas.component';
import { GestionTipoDocumentoComponent } from '../gestion-tipo-documento/gestion-tipo-documento.component';
import { GestionTratamientoComponent } from '../gestion-tratamiento/gestion-tratamiento.component';
@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [GestionDentistasComponent, GestionTipoDocumentoComponent, GestionTratamientoComponent],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdministradorComponent {
    
}