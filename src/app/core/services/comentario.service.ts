import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../interfaces/comentario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http: HttpClient) { }

  getComentarios():Observable<Comentario[]> {
    return this.http.get<Comentario[]>(environment.apiUrl +'comentarios');
  }

  createComentario(contenido: string, usuarioId: number, comentarioId: number | null): Observable<any>{
    return this.http.post<any>(environment.apiUrl +'comentarios', {
      contenido,
      usuarioId,
      comentarioId
    });
  }

}
