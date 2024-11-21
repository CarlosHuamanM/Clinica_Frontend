import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Cita } from '../../core/interfaces/cita';
import { CitaService } from '../../core/services/cita.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatepickerComponent } from '../../core/components/datepicker/datepicker.component';
import { HorarioService } from '../../core/services/horario.service';
import { Horario } from '../../core/interfaces/horario';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [AsyncPipe, ModalComponent, DatepickerComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  citas!: Observable<Cita[]>;
  citaService = inject(CitaService);
  authService = inject(AuthService);
  horarioService = inject(HorarioService);
  toastService = inject(ToastrService);
  userId!: number;

  horarios!: Observable<Horario[]>;
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 5, 0));
  minTimeValue: string | undefined = '';
  maxTimeValue: string | undefined = '';
  disabledDates: Date[] = [];
  activeDaysOfWeek: number[] = [];

  @ViewChild('modalCancelación') modalCancelacion!: ModalComponent;
  @ViewChild('modalReprogramar') modalReprogramar!: ModalComponent;
  trackedCita!: Cita;

  formReprogramar: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formReprogramar = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.citas = this.citaService.getCitas({ usuarioId: this.userId });
  }

  cancelarReserva(id: number) {
    this.citaService.deleteCita(id).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.citas = this.citaService.getCitas({ usuarioId: this.userId });
      },
      error: (error) => {
        console.log('Error al cancelar la reserva:' + error.message);
      }
    });
    this.modalCancelacion.close();
  }

  establecerHorarios(cita: Cita) {
    const queryparams = {
      dentistaId: cita.dentista.id,
    }
    this.horarios = this.horarioService.getHorarios(queryparams);
    this.horarios.subscribe((data) => {
      this.activeDaysOfWeek = this.horarioService.calculateActiveDays(data);
      this.disabledDates = this.horarioService.calculateDisabledDates();
    });
  }
  reprogramarReserva(id: number) {
    this.modalReprogramar.open();
  }

  handleDateSelected(date: Date) {

  }

}
