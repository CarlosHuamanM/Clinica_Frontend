import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Tratamiento } from '../interfaces/tratamiento';
import { TipoTratamiento } from '../interfaces/tipo-tratamiento';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  baseUrl = environment.apiUrl + 'tratamientos';
  constructor(private http: HttpClient) { }

  getTratamientos(queryparams?: any): Observable<Tratamiento[]>{
    return this.http.get<Tratamiento[]>(this.baseUrl, {params: queryparams});
  }

  getTiposTratamientos(): Observable<TipoTratamiento[]>{
    return this.http.get<TipoTratamiento[]>(environment.apiUrl + 'tipo-tratamiento');
  }

  createTratamiento(data: any): Observable<any>{
    return this.http.post<any>(this.baseUrl, data);
  }

  updateTratamiento(id: number, data: any): Observable<any>{
    return this.http.put<any>(this.baseUrl + '/' + id, data);
  }

  deleteTratamiento(id: number): Observable<any>{
    return this.http.delete<any>(this.baseUrl + '/' + id);
  }
}
