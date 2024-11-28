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

  getValidationByDateAndHour(data: any): Observable<boolean>{
    return this.http.post<boolean>(this.baseUrl + '/validar', data);
  }

  createCita(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl, data);
  }

  deleteCita(id: number): Observable<any>{
    return this.http.delete<any>(this.baseUrl + '/' + id);
  }

  successCita(id: number): Observable<any>{
    return this.http.put<any>(this.baseUrl + '/atender/' + id, {});
  }
}
