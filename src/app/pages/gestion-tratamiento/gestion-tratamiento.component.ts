import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';

@Component({
  selector: 'app-gestion-tratamiento',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './gestion-tratamiento.component.html',
  styleUrl: './gestion-tratamiento.component.css'
})
export class GestionTratamientoComponent {

  tratamientos: Observable<Tratamiento[]>;

  constructor(private tratamientoService: TratamientoService) {
    this.tratamientos = this.tratamientoService.getTratamientos({});
  }
}
