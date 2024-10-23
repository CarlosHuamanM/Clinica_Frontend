import { Component } from '@angular/core';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  paginaActual: number = 1;

  motivoConsulta: string = '';
  especialidad: string = '';
  profesional: string = '';

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }
}

