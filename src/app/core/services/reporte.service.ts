import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private baseUrl = environment.apiUrl + 'reportes';
  constructor(private http: HttpClient) { }

  getReportePorMesYSexo(year: number, month: number): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-mes-y-sexo', { params: {
      year,
      month,
    }});
  }
  downloadReportePorMesYSexo(year: number, month: number, usuarioId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-mes-y-sexo/download', { params: {
      year,
      month,
      usuarioId,
    },
    responseType: 'blob'
    });
  }

  getReportePorTipoTratamiento(year: number, month: number): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-tipo-tratamiento', { params: {
      year,
      month,
    }});
  }

  downloadReportePorTipoTratamiento(year: number, month: number, usuarioId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-tipo-tratamiento/download', { params: {
      year,
      month,
      usuarioId,
    },
    responseType: 'blob'
    });
  }

  getReportePorEstadoCita(year: number, estado: string): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-estado', { params: {
      year,
      estado,
    }});
  }

  downloadReportePorEstadoCita(year: number, estado: string, usuarioId: number): Observable<any> {
    return this.http.get(this.baseUrl + '/citas-por-estado/download', { params: {
      year,
      estado,
      usuarioId,
    },
  responseType: 'blob'
    });
  }
}
