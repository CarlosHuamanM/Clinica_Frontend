import { Component, inject, OnInit } from '@angular/core';
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
  imports: [AsyncPipe],
  templateUrl: './agregarhorario.component.html',
  styleUrl: './agregarhorario.component.css'
})
export class AgregarhorarioComponent implements OnInit {

  horarioService = inject(HorarioService);
  horarios!: Observable<Horario[]>;
  authService = inject(AuthService);
  dentistaId!: number;

  agregarHorarioForm= new FormGroup({
    dia: new FormControl('', Validators.required),
    horaInicio: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')]),
    horaFin: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')])
  });
  
  ngOnInit(): void {
    this.dentistaId = this.authService.getDentistaId();
    console.log(this.dentistaId);
    this.loadData({dentistaId: this.dentistaId});
  }
  loadData(queryparams: any): void {
    this.horarios = this.horarioService.getHorarios(queryparams);
  }

  constructor(){
    
  }
}
