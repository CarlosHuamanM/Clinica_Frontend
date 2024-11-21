import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../interfaces/tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  apiUrl = environment.apiUrl + 'tipo-documento';
  constructor(private http: HttpClient) { }

  getTiposDocumento(data: any): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.apiUrl, { params: data });
  }
}
