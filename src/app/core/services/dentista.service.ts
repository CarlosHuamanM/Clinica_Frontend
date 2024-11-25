import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../interfaces/tipo-documento';
import { Dentista } from '../interfaces/dentista';

@Injectable({
  providedIn: 'root'
})
export class DentistaService {

  baseUrl = environment.apiUrl + 'dentistas';
  constructor(private http: HttpClient) { }

  getDentistas(queryparams?: any): Observable<Dentista[]>{
    return this.http.get<Dentista[]>(this.baseUrl, {params: queryparams});
  }

  getEspecialidades(): Observable<String[]>{
    return this.http.get<String[]>(this.baseUrl + '/especialidades');
  }

  createDentista(data:any): Observable<any>{
    return this.http.post<any>(this.baseUrl, data);
  }
  updateDentista(id: number, data: any): Observable<any>{
    return this.http.put<any>(this.baseUrl + '/' + id, data);
  }
  deleteDentista(id: number): Observable<any>{
    return this.http.delete<any>(this.baseUrl + '/' + id);
  }
}
