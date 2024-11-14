import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import timeGridPlugin from '@fullcalendar/timegrid';
import { StepperComponent } from '../../core/components/stepper/stepper.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FullCalendarModule, StepperComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit {

  reservaForm = new FormGroup({
    tipo: new FormGroup({
      tratamientoId: new FormControl(''),
      especialidad: new FormControl(''),
      dentistaId: new FormControl('')
    }),
    horario: new FormGroup({
      fecha: new FormControl(''),
      hora: new FormControl('')
    }),
    paciente: new FormGroup({
      nombres: new FormControl(''),
      apellidoPaterno: new FormControl(''),
      apellidoMaterno: new FormControl(''),
      tipoDocumento: new FormControl(''),
      numeroIdentidad: new FormControl(''),
      sexo: new FormControl(''),
      fechaNacimiento: new FormControl('')
    })
  });

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {

  }

}

