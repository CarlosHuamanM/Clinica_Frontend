import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtResponse } from '../interfaces/jwt-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiAuthUrl = environment.apiUrl + 'auth/';
  constructor(private http: HttpClient) { }

  login(email: string, contrasena: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiAuthUrl + 'login', {
      email,
      contrasena
    });
  }

  register(correo: string, contrasena: string, nombres: string, tipoDocumento:string, fechaNacimiento:string, apellidoPaterno: string, apellidoMaterno: string, documento: string, telefono: string, sexo: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiAuthUrl + 'register', {
      correo,
      tipoDocumento,
      documento,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      telefono,
      sexo,
      contrasena
    });
  }

  getCode(email: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'email/sendcode', {
      email
    });
  }

  getNamesWithReniecService(documento: string): Observable<any>{
    return this.http.get<any>(environment.apiUrl + 'reniec', {
      params: {
        dni: documento
      }
    });
  }
}
