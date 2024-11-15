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
  constructor(private http: HttpClient) { }

  getHorarios(queryparams: any): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.baseUrl, { params: queryparams });
  }
}
