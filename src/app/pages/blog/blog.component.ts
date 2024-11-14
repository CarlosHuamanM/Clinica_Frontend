import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { QuestionComponent } from '../../core/components/question/question.component';
import { Comentario } from '../../core/interfaces/comentario';
import { Observable, ObservedValueOf } from 'rxjs';
import { ComentarioService } from '../../core/services/comentario.service';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NavbarComponent, QuestionComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {

  comentarios!: Observable<Comentario[]>;
  comentarioService = inject(ComentarioService);
  toast = inject(ToastrService);

  userRole = "";
  userId = 0;
  nombresUsuario = "";
  authService = inject(AuthService);
  trackedQuestionId: number | null = null;

  disabledButton = false;

  preguntaPaciente = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);

  ngOnInit(): void {
    this.comentarios = this.comentarioService.getComentarios();
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.nombresUsuario = this.authService.getNames();
    if (this.userRole === 'PACIENTE' || !this.userRole) {
      this.disabledButton = true;
    }
  }
  recargarComentarios(){
    this.comentarios = this.comentarioService.getComentarios();
  }

  comentar() {
    if (this.preguntaPaciente.value != '' && this.userId) {
      this.comentarioService.createComentario(
        this.preguntaPaciente.value ?? '',
        this.userId,
        this.trackedQuestionId
      ).subscribe({
        next: (response) => {
          this.toast.success('Comentario creado');
          this.comentarios = this.comentarioService.getComentarios();
          this.preguntaPaciente.reset();
        },
        error: (error) => {
          console.log('Error durante el comentario:' + error.message);
          this.toast.error('Error durante le envío del comentario');
        }
      })
    }else{
      this.toast.info('Debes escribir un comentario válido');
    }
  }

}
