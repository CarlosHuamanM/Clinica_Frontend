import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, ViewChildren } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { StepperComponent } from '../../core/components/stepper/stepper.component';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FullCalendarModule, StepperComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit{

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    themeSystem: 'bootstrap5',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    events: [
      { title: 'event 1', date: '2024-09-01' },
      { title: 'event 2', date: '2024-09-20' }
    ]
  };
  handleDateClick(arg: any) {
    alert('La fecha que seleccionaste es: ' + arg.dateStr);
  }
  handleEventClick(arg: any) {
    alert('El evento que seleccionaste es: ' + arg.event.title);
  }
  @ViewChild('bodypd') bodypd!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('navbar') navBar!: ElementRef;
  @ViewChild('headertoggle') headerToggle!: ElementRef;
  @ViewChildren('navlink') navLinks!: ElementRef;

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
    
  }

  showNavbar(){
      this.navBar.nativeElement.classList.toggle('show')
      this.headerToggle.nativeElement.classList.toggle('bx-x')
      this.bodypd.nativeElement.classList.toggle('body-pd')
      this.header.nativeElement.classList.toggle('body-pd')
  }

}

