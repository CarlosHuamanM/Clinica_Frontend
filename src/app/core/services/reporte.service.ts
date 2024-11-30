import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CitaSexo } from '../interfaces/cita-sexo';
import { CitaTipoTratamiento } from '../interfaces/cita-tipo-tratamiento';
import { CitaCancelada } from '../interfaces/cita-cancelada';
import { CitaDentista } from '../interfaces/cita-dentista';
import { DataReport } from '../interfaces/data-report';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private baseUrl = environment.apiUrl + 'reportes';
  constructor(private http: HttpClient) { }

  getDataReports(): Observable<DataReport[]> {
    return this.http.get<DataReport[]>(environment.apiUrl + 'data-reportes');
  }

  countCitasByDateAndSexo(params: any): Observable<CitaSexo[]> {
    return this.http.get<CitaSexo[]>(`${this.baseUrl}/sexo`, { params });
  }

  countCitasByDateAndTipoTratamiento(params: any): Observable<CitaTipoTratamiento[]> {
    return this.http.get<CitaTipoTratamiento[]>(`${this.baseUrl}/tipo-tratamiento`, { params });
  }

  countCitasCanceladasByFecha(params: any): Observable<CitaCancelada[]> {
    return this.http.get<CitaCancelada[]>(`${this.baseUrl}/canceladas`, { params });
  }

  countCitasAtendidasPorDentista(params: any): Observable<CitaDentista[]> {
    return this.http.get<CitaDentista[]>(`${this.baseUrl}/dentista`, { params });
  }

  downloadReportCitasPorSexo(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/sexo/download`, { params, responseType: 'blob' });
  }
  downloadReportCitasPorTipo(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipo-tratamiento/download`, { params, responseType: 'blob' });
  }
  downloadReportCitasPorEstado(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/canceladas/download`, { params, responseType: 'blob' });
  }
  downloadReportCitasPorFecha(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/dentista/download`, { params, responseType: 'blob' });
  }
}
