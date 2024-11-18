import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { StepperComponent } from '../../core/components/stepper/stepper.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { DentistaService } from '../../core/services/dentista.service';
import { Dentista } from '../../core/interfaces/dentista';
import { TipoTratamiento } from '../../core/interfaces/tipo-tratamiento';
import { Horario } from '../../core/interfaces/horario';
import { HorarioService } from '../../core/services/horario.service';
import { DatepickerComponent } from '../../core/components/datepicker/datepicker.component';
import { Cita } from '../../core/interfaces/cita';
import { CalendarComponent } from '../../core/components/calendar/calendar.component';
import { AuthService } from '../../core/services/auth.service';
import { CitaService } from '../../core/services/cita.service';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';
import { TipoDocumento } from '../../core/interfaces/tipo-documento';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [StepperComponent, AsyncPipe, ReactiveFormsModule, DatepickerComponent, CalendarComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit {

  //variables para la consulta de datos
  tratamientos!: Observable<Tratamiento[]>;
  especialidades!: Observable<String[]>;
  dentistas!: Observable<Dentista[]>;
  tiposTratamientos!: Observable<TipoTratamiento[]>;
  horarios!: Observable<Horario[]>;
  userId!: number;
  citas!: Cita[];
  tiposDocumento!: Observable<TipoDocumento[]>


  //inyeccion de servicios
  tratamientoService = inject(TratamientoService);
  dentistaService = inject(DentistaService);
  horariosService = inject(HorarioService);
  authService = inject(AuthService);
  citaService = inject(CitaService);
  toastService = inject(ToastrService);
  tipoDocumentoService = inject(TipoDocumentoService);

  //variables para el manejo del calendario
  disabledDates: Date[] = [];
  activeDaysOfWeek: number[] = [];
  selectedDate: string | null = null;
  horarioSelected: Horario | undefined;
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 5));
  minTimeValue: string | undefined = '';
  maxTimeValue: string | undefined = '';

  //variables para el formulario
  reservaForm: FormGroup;

  ngOnInit() {
    this.tratamientos = this.tratamientoService.getTratamientos({});
    this.tiposTratamientos = this.tratamientoService.getTiposTratamientos();
    this.especialidades = this.dentistaService.getEspecialidades();
    this.dentistas = this.dentistaService.getDentistas({});
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento();
    this.userId = this.authService.getUserId();
    this.citaService.getCitas({ usuarioId: this.userId }).subscribe({
      next: (response) => {
        this.citas = response;
        console.log(this.citas);
      },
      error: (error) => {
        console.log('Error durante la consulta de citas:' + error.message);
        this.toastService.error(error.message);
      }
    });
  }


  constructor(private fb: FormBuilder) {
    this.reservaForm = this.fb.group({
      tipo: this.fb.group({
        tipoTratamiento: ['', Validators.required],
        tratamientoId: [{ value: '', disabled: true }, Validators.required],
        especialidad: ['', Validators.required],
        dentistaId: [{ value: '', disabled: true }, Validators.required]
      }),
      horario: this.fb.group({
        fecha: [null, Validators.required],
        hora: [{ value: '', disabled: true }, Validators.required]
      }),
      paciente: this.fb.group({
        nombres: ['', Validators.required],
        apellidoPaterno: ['', Validators.required],
        apellidoMaterno: ['', Validators.required],
        tipoDocumento: ['', Validators.required],
        numeroIdentidad: [{ value: '', disabled: true }, Validators.required],
        sexo: ['', Validators.required],
        fechaNacimiento: ['', Validators.required, this.edadMayorDe18Validator()]
      })
    });
  }

  edadMayorDe18Validator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaNacimiento = new Date(control.value);
      const fechaHoy = new Date();
      if (!control.value) { return null; }
      let edad = fechaHoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = fechaHoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && fechaHoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad >= 18 ? null : { edadInvalida: true };
    };
  }

  calculateActiveDays(horarios: Horario[]): void {
    const activeDays = new Set<number>();
    horarios.forEach((horario) => {
      const dayOfWeek = this.mapDayToNumber(horario.dia);
      if (dayOfWeek !== null) {
        activeDays.add(dayOfWeek);
      }
    });
    this.activeDaysOfWeek = Array.from(activeDays);

    this.calculateDisabledDates();
  }

  mapDayToNumber(day: string): number | null {
    const daysMap: { [key: string]: number } = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      domingo: 0,
    };
    return daysMap[day.toLowerCase()] ?? null;
  }

  calculateDisabledDates(): void {
    const today = new Date();
    const dates: Date[] = [];

    for (let i = 0; i < 180; i++) {
      const current = new Date(today);
      current.setDate(today.getDate() + i);

      if (!this.activeDaysOfWeek.includes(current.getDay())) {
        dates.push(current);
      }
    }

    this.disabledDates = dates;
  }

  convertirDuracionAMinutos(duracionISO: string): number {
    let minutos = 0;
    const match = duracionISO.match(/PT(\d+H)?(\d+M)?/);

    if (match) {
      if (match[1]) {
        minutos += parseInt(match[1]) * 60;
      }
      if (match[2]) {
        minutos += parseInt(match[2]);
      }
    }

    return minutos;
  }

  buscarDentistaPorEspecialidad(event: Event) {
    const target = event.target as HTMLSelectElement;
    const especialidad = target.value;
    const queryparams = {
      especialidad: especialidad
    };
    this.dentistas = this.dentistaService.getDentistas(queryparams);
    this.reservaForm.get('tipo')?.get('dentistaId')?.enable();
  }

  buscarTipoTratamiento(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tipoTratamiento = target.value;
    const queryparams = {
      tipo: tipoTratamiento
    };
    this.tratamientos = this.tratamientoService.getTratamientos(queryparams);
    this.reservaForm.get('tipo')?.get('tratamientoId')?.enable();
  }

  establecerHorariosPorDentista(event: Event) {
    const target = event.target as HTMLSelectElement;
    const dentistaId = target.value;
    const queryparams = {
      dentistaId: dentistaId
    };
    this.horarios = this.horariosService.getHorarios(queryparams);
    this.horarios.subscribe((data) => {
      this.calculateActiveDays(data);
    });
    this.reservaForm.get('horario')?.get('fecha')?.enable();
  }

  handleDateSelected(date: Date) {
    this.reservaForm.get('horario')?.get('fecha')?.reset();
    this.reservaForm.get('horario')?.get('hora')?.reset();
    if (date instanceof Date) {
      const formattedDate = date.toISOString().split('T')[0];
      this.selectedDate = formattedDate;
      this.reservaForm.get('horario')?.get('fecha')?.setValue(formattedDate);
    }
    //obtener el dia de la fecha seleccionada
    const dia = date.toLocaleString('es-ES', { weekday: 'long' }).toUpperCase();
    //filtrar horario por la fecha seleccionada
    const queryparams = {
      dentistaId: this.reservaForm.get('tipo')?.get('dentistaId')?.value,
      dia: dia
    };
    this.horariosService.getHorarios(queryparams).subscribe((horarios) => {
      this.horarioSelected = horarios.find((horario) => horario.dia.toUpperCase() === dia);
      this.minTimeValue = this.horarioSelected?.horaComienzo.substring(0, 5);
      this.maxTimeValue = this.horarioSelected?.horaFin.substring(0, 5);
      console.log(this.minTimeValue, this.maxTimeValue);
      this.reservaForm.get('horario')?.get('hora')?.setValidators([Validators.required, this.timeRangeValidator(this.minTimeValue ?? '', this.maxTimeValue ?? '')]);
    });
    this.reservaForm.get('horario')?.get('hora')?.enable();
  }

  timeRangeValidator(min: string, max: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) {
        return null; // Campo vacío
      }

      if (value < min || value > max) {
        return { outOfRange: true };
      }
      return null; // Válido
    };
  }

  agregarValidadores(event: Event) {
    const target = event.target as HTMLSelectElement;
    const tipoDocumento = target.value;
    switch (tipoDocumento) {
      case "DNI":
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.enable();
        break;
      case "PASAPORTE":
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.setValidators([Validators.required, Validators.maxLength(20)]);
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.enable();
        break;
      case "CARNET EXT.":
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.setValidators([Validators.required, Validators.maxLength(20)]);
        this.reservaForm.get('paciente')?.get('numeroIdentidad')?.enable();
        break;
      default:
        break;
    }
  }
}

