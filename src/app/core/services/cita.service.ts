import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita } from '../interfaces/cita';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private baseUrl = environment.apiUrl + 'citas';

  constructor(private http: HttpClient) { }

  getCitas(queryparams: any): Observable<Cita[]>{
    return this.http.get<Cita[]>(this.baseUrl, { params: queryparams });
  }
}
