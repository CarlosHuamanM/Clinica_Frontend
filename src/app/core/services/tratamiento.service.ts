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
}
