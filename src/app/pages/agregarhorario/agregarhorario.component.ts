import { Component, inject, OnInit } from '@angular/core';
import { CalendarComponent } from "../../core/components/calendar/calendar.component";
import { HorarioService } from "../../core/services/horario.service";
import { Horario } from "../../core/interfaces/horario";
import { Observable } from "rxjs";
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { time } from 'console';
import { timeRangeValidator } from '../../core/validators/time-range.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agregarhorario',
  standalone: true,
  imports: [AsyncPipe, CommonModule,ReactiveFormsModule ],
  templateUrl: './agregarhorario.component.html',
  styleUrl: './agregarhorario.component.css'
})
export class AgregarhorarioComponent implements OnInit {

  horarioService = inject(HorarioService);
  horarios!: Observable<Horario[]>;
  authService = inject(AuthService);
  dentistaId!: number;
  toastService = inject(ToastrService);

  agregarHorarioForm= new FormGroup({
    dia: new FormControl('', Validators.required),
    horaInicio: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')]),
    horaFin: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')])
  });
  
  
  ngOnInit(): void {
    this.dentistaId = this.authService.getDentistaId();
    console.log('Dentista ID en ngOnInit:', this.dentistaId);
  
    if (!this.dentistaId) {
      console.error('No se pudo cargar el ID del dentista desde AuthService.');
      this.toastService.error('Error al cargar los datos del usuario.');
      return;
    }
    this.loadData({ dentistaId: this.dentistaId });
  }
  
  loadData(queryparams: any): void {
    this.dentistaId = this.authService.getDentistaId();
    this.horarios = this.horarioService.getHorarios(queryparams);
  }
  agregarHorario() {
    if (!this.dentistaId) {
      console.error('El ID del dentista no está definido.');
      this.toastService.error('Error: no se encontró el ID del dentista.');
      return;
    }
    const data = {
      dentistaId: this.dentistaId,
      dia: this.agregarHorarioForm.get('dia')?.value ?? '',
      horaInicio: this.agregarHorarioForm.get('horaInicio')?.value ?? '',
      horaFin: this.agregarHorarioForm.get('horaFin')?.value ?? '',
    };
  
    this.horarioService.createHorario(data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadData({ dentistaId: this.dentistaId });
      },
      error: (error) => {
        console.error('Error durante el registro:', error.message);
        this.toastService.error('Error durante el registro: ' + error.message);
      },
    });
  }  
}

