import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from "../../core/components/calendar/calendar.component";
import { HorarioService } from "../../core/services/horario.service";
import { Horario } from "../../core/interfaces/horario";
import { Observable } from "rxjs";
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { time } from 'console';
import { timeRangeValidator } from '../../core/validators/time-range.validator';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-agregarhorario',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, ModalComponent],
  templateUrl: './agregarhorario.component.html',
  styleUrl: './agregarhorario.component.css'
})
export class AgregarhorarioComponent implements OnInit {

  horarioService = inject(HorarioService);
  horarios!: Observable<Horario[]>;
  authService = inject(AuthService);
  dentistaId!: number;
  toastService = inject(ToastrService);

  trackedHorario!: Horario;

  agregarHorarioForm= new FormGroup({
    dia: new FormControl('', Validators.required),
    horaInicio: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')]),
    horaFin: new FormControl('', [Validators.required, timeRangeValidator('09:00', '22:00')])
  });

  @ViewChild('modalDelete') modalDelete!: ModalComponent;
  
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
  openModalToDelete(horario: Horario){
    this.trackedHorario = horario;
    this.modalDelete.open();
  }
  agregarHorario(){
    const data = {
      dia: this.agregarHorarioForm.value.dia,
      horaComienzo: this.agregarHorarioForm.value.horaInicio,
      horaFin: this.agregarHorarioForm.value.horaFin,
      dentistaId: this.dentistaId
    }
    this.horarioService.createHorario(data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadData({dentistaId: this.dentistaId});
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    })
  }
  eliminarHorario(){
    this.horarioService.deleteHorario(this.trackedHorario.id).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadData({dentistaId: this.dentistaId});
        this.modalDelete.close();
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    })
  }
}
