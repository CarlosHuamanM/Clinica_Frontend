import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Horario } from '../interfaces/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private baseUrl = environment.apiUrl + 'horarios';
  private activeDaysOfWeek: number[] = [];
  private disabledDates: Date[] = [];


  constructor(private http: HttpClient) { }

  getHorarios(queryparams: any): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.baseUrl, { params: queryparams });
  }
  createHorario(data:any): Observable<any>{
    return this.http.post<any>(this.baseUrl, data);
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

  calculateActiveDays(horarios: { dia: string }[]): number[] {
    const activeDays = new Set<number>();
    horarios.forEach((horario) => {
      const dayOfWeek = this.mapDayToNumber(horario.dia);
      if (dayOfWeek !== null) {
        activeDays.add(dayOfWeek);
      }
    });

    this.activeDaysOfWeek = Array.from(activeDays);
    return this.activeDaysOfWeek;
  }

  calculateDisabledDates(): Date[] {
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
    return this.disabledDates;
  }

  getDisabledDates(): Date[] {
    return this.disabledDates;
  }

  getActiveDaysOfWeek(): number[] {
    return this.activeDaysOfWeek;
  }
  
}
