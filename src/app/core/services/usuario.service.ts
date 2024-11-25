import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = environment.apiUrl + 'usuarios';
  constructor(private http: HttpClient) { }

  getUsuarios(params: any): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, { params: params });
  }
}
