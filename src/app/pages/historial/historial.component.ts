import { Component, inject, OnInit } from '@angular/core';
import { Cita } from '../../core/interfaces/cita';
import { CitaService } from '../../core/services/cita.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  citas!: Observable<Cita[]>;
  citaService = inject(CitaService);
  authService = inject(AuthService);
  userId!: number;

  ngOnInit(): void {
      this.userId = this.authService.getUserId();
      this.citas = this.citaService.getCitas({usuarioId: this.userId});
  }

}
