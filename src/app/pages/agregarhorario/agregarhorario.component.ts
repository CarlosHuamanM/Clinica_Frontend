import { Component, inject } from '@angular/core';
import { CalendarComponent } from "../../core/components/calendar/calendar.component";
import { HorarioService } from "../../core/services/horario.service";
import { Horario } from "../../core/interfaces/horario";
import { Observable } from "rxjs";
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { time } from 'console';
import { timeRangeValidator } from '../../core/validators/time-range.validator';

@Component({
  selector: 'app-agregarhorario',
  standalone: true,
  imports: [CalendarComponent, AsyncPipe],
  templateUrl: './agregarhorario.component.html',
  styleUrl: './agregarhorario.component.css'
})
export class AgregarhorarioComponent {

  HorarioService = inject(HorarioService);
  Horarios!: Observable<Horario[]>;
  horarios: Horario[] = [];
  authService = inject(AuthService);
  dentistId!: number;

  agregarHorarioForm= new FormGroup({
    dia: new FormControl('', Validators.required),
    horaInicio: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')]),
    horaFin: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')])
  });

  ngOnInit(): void {
    this.dentistId = this.authService.getDentistaId();
    this.loadData({dentistaId: this.dentistId});
}
loadData(queryparams: any): void {
  this.Horarios= this.HorarioService.getHorarios(queryparams);
}

}
