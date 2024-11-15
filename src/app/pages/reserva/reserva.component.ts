import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { StepperComponent } from '../../core/components/stepper/stepper.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { DentistaService } from '../../core/services/dentista.service';
import { Dentista } from '../../core/interfaces/dentista';
import { TipoTratamiento } from '../../core/interfaces/tipo-tratamiento';
import { Horario } from '../../core/interfaces/horario';
import { HorarioService } from '../../core/services/horario.service';
import { DatepickerComponent } from '../../core/components/datepicker/datepicker.component';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FullCalendarModule, StepperComponent, AsyncPipe, ReactiveFormsModule, DatepickerComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit {

  tratamientos!: Observable<Tratamiento[]>;
  especialidades!: Observable<String[]>;
  dentistas!: Observable<Dentista[]>;
  tiposTratamientos!: Observable<TipoTratamiento[]>;
  horarios!: Observable<Horario[]>;

  tratamientoService = inject(TratamientoService);
  dentistaService = inject(DentistaService);
  horariosService = inject(HorarioService);

  diasDisponibles: number[] = [];
  horaInicio: string = '';
  horaFin: string = '';

  disabledDates = [
    new Date(2024, 1, 5), 
    new Date(2024, 10, 15), 
    new Date(2024, 10, 25)
  ];

  reservaForm: FormGroup;

  ngOnInit() {
    
    this.tratamientos = this.tratamientoService.getTratamientos({});
    this.tiposTratamientos = this.tratamientoService.getTiposTratamientos();
    this.especialidades = this.dentistaService.getEspecialidades();
    this.dentistas = this.dentistaService.getDentistas({});
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    themeSystem: 'bootstrap5',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    events: [
      { title: 'Cita con Oliva', date: '2024-11-14', start: '2024-11-14T12:30:00', end: '2024-11-14T16:00:00' },
      { title: 'Cita con Oliva', date: '2024-11-15', start: '2024-11-15T12:30:00', end: '2024-11-15T16:00:00' },
    ]
  };
  handleDateClick(arg: any) {
    alert('La fecha que seleccionaste es: ' + arg.dateStr);
  }
  handleEventClick(arg: any) {
    alert('El evento que seleccionaste es: ' + arg.event.title);
  }

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.reservaForm = this.fb.group({
      tipo: this.fb.group({
        tipoTratamiento: ['', Validators.required],
        tratamientoId: [{ value: '', disabled: true }, Validators.required],
        especialidad: ['', Validators.required],
        dentistaId: [{ value: '', disabled: true }, Validators.required]
      }),
      horario: this.fb.group({
        fecha: [null],
        hora: [{ value: '', disabled: true }, Validators.required]
      }),
      paciente: this.fb.group({
        nombres: [''],
        apellidoPaterno: [''],
        apellidoMaterno: [''],
        tipoDocumento: [''],
        numeroIdentidad: [''],
        sexo: [''],
        fechaNacimiento: ['']
      })
    });
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

  establecerHorariosPorDentista(event: Event){
    const target = event.target as HTMLSelectElement;
    const dentistaId = target.value;
    const queryparams = {
      dentistaId: dentistaId
    };
    this.horarios = this.horariosService.getHorarios(queryparams);
    this.reservaForm.get('horario')?.get('fecha')?.enable();
    this.reservaForm.get('horario')?.get('hora')?.enable();
  }

  handleDateSelected(date: Date){
    this.reservaForm.get('horario')?.get('fecha')?.setValue(date);
    this.reservaForm.get('horario')?.get('hora')?.enable();
  }

  mostrarFormulario(){
    console.log(this.reservaForm);
  }
}

