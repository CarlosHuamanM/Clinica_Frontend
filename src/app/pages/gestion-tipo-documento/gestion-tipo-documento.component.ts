import { Component } from '@angular/core';
import { TipoDocumento } from '../../core/interfaces/tipo-documento';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-tipo-documento',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './gestion-tipo-documento.component.html',
  styleUrl: './gestion-tipo-documento.component.css'
})
export class GestionTipoDocumentoComponent {
  tiposDocumento: Observable<TipoDocumento[]>;
  busquedaForm = new FormGroup({
    busqueda: new FormControl('')
  });
  constructor(private tipoDocumentoService: TipoDocumentoService) {
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento({});
  }
  onBusquedaChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const busqueda = target.value;
    
    const queryparams: any = {
      nombre: busqueda
    };
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento(queryparams);
  }
}
