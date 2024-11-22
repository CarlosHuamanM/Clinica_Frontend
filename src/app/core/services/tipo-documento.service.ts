import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../interfaces/tipo-documento';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  apiUrl = environment.apiUrl + 'tipo-documento';
  constructor(private http: HttpClient) { }

  getTiposDocumento(data: any): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.apiUrl, { params: data });
  }

  createTipoDocumento(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'tipo-documento', data);
  }

  updateTipoDocumento(id: number, data: any): Observable<any> {
    return this.http.put<any>(environment.apiUrl + 'tipo-documento/' + id, data);
  }

  deleteTipoDocumento(id: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + 'tipo-documento/' + id);
  }
}
