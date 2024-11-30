import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CitaService } from '../../core/services/cita.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from '../../core/components/datepicker/datepicker.component';
import { HorarioService } from '../../core/services/horario.service';
import { timeRangeValidator } from '../../core/validators/time-range.validator';
import { citaValidator } from '../../core/validators/cita.validator';
import { Horario } from '../../core/interfaces/horario';
import { Cita } from '../../core/interfaces/cita';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ModalComponent, DatepickerComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  currentPageCita: number = 1;
  totalPagesCita: number = 1;
  paginatedCitas: Cita[] = [];

  formCitas = new FormGroup({
    fechaInicio: new FormControl('2024-11-01', Validators.required),
    fechaFin: new FormControl('2024-12-12', Validators.required),
    estado: new FormControl('Pendiente', Validators.required),
  });
  
  citaService = inject(CitaService);
  authService = inject(AuthService);
  horarioService = inject(HorarioService);
  toastService = inject(ToastrService);
  userId!: number;
  activarBoton = true;

  horarios!: Observable<Horario[]>;
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 5, 0));
  minTimeValue: string | undefined = ''; 
  maxTimeValue: string | undefined = '';
  disabledDates: Date[] = [];
  activeDaysOfWeek: number[] = [];
  selectedDate: string | null = null;
  horarioSelected: Horario | undefined;

  @ViewChild('modalCancelación') modalCancelacion!: ModalComponent;
  @ViewChild('modalReprogramar') modalReprogramar!: ModalComponent;
  trackedCita!: Cita;

  formReprogramar: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formReprogramar = this.fb.group({
      fecha: [{ value: '', disabled: true }, Validators.required],
      hora: [{ value: '', disabled: true }, Validators.required]
    });
  }
  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadData();
  }
  loadData(): void {
    this.citaService.getCitas({ usuarioId: this.userId }).subscribe((data) => {
      this.totalPagesCita = Math.ceil(data.length / 5);
      this.paginatedCitas = this.paginate(data, this.currentPageCita, 5);
    });
  }
  loadDataWithParams(): void {
    this.citaService.getCitas({ usuarioId: this.userId, fechaInicio: this.formCitas.get('fechaInicio')?.value ?? '2024-11-01', fechaFin: this.formCitas.get('fechaFin')?.value ?? '2024-12-12', estado: this.formCitas.get('estado')?.value ?? 'Pendiente' }).subscribe((data) => {
      this.totalPagesCita = Math.ceil(data.length / 5);
      this.paginatedCitas = this.paginate(data, this.currentPageCita, 5);
    });
  }
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  onPageChangeCita(page: number): void {
    if (page < 1 || page > this.totalPagesCita) return;
    this.currentPageCita = page;
    this.loadDataWithParams();
  }
  openModalToCancel(cita: Cita) {
    this.trackedCita = cita;
    this.modalCancelacion.open();
  }
  openModalToReprogramar(cita: Cita) {
    console.log(this.formReprogramar.value);
    this.formReprogramar.reset();
    this.formReprogramar.get('fecha')?.setValidators([Validators.required]);
    this.formReprogramar.get('hora')?.setValidators([Validators.required]);
    this.trackedCita = cita;
    this.modalReprogramar.open();
  }

  cancelarReserva() {
    this.citaService.deleteCita(this.trackedCita.id).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.loadDataWithParams();
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
  reprogramarReserva() {
    this.citaService.editCita(
      this.trackedCita.id,
      {
        hora: this.formReprogramar.get('hora')?.value,
        fecha: this.formReprogramar.get('fecha')?.value,
      }
    ).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.modalReprogramar.close();
        this.loadDataWithParams();
      },
      error: (error) => {
        console.error('Error al reprogramar la reserva:', error);
        this.toastService.error(error.error.message);
      }
    });
  }

  handleDateSelected(date: Date) {
    this.formReprogramar.get('hora')?.reset();
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split('T')[0];
      this.selectedDate = formattedDate;
      this.formReprogramar.get('fecha')?.setValue(formattedDate);
    }
    //obtener el dia de la fecha seleccionada
    const dia = date.toLocaleString('es-ES', { weekday: 'long' }).toUpperCase();
    //filtrar horario por la fecha seleccionada
    const queryparams = {
      dentistaId: this.trackedCita.dentista.id,
      dia: dia
    };
    this.horarioService.getHorarios(queryparams).subscribe((horarios) => {
      this.horarioSelected = horarios.find((horario) => horario.dia.toUpperCase() === dia);
      this.minTimeValue = this.horarioSelected?.horaComienzo.substring(0, 5);
      this.maxTimeValue = this.horarioSelected?.horaFin.substring(0, 5);
      console.log(this.minTimeValue, this.maxTimeValue);
      this.formReprogramar.get('hora')?.setValidators([
        Validators.required,
        timeRangeValidator(this.minTimeValue ?? '', this.maxTimeValue ?? '')
      ]);
      this.formReprogramar.get('hora')?.setAsyncValidators(
        citaValidator(
          this.citaService,
          this.formReprogramar.get('fecha')?.value,
          this.trackedCita.tratamiento.id,
          this.trackedCita.dentista.id
        )
      );
    });
    this.formReprogramar.get('hora')?.enable();
  }

}
