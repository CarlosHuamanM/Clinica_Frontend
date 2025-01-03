import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AnswerComponent } from '../answer/answer.component';
import { Comentario } from '../../interfaces/comentario';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentarioService } from '../../services/comentario.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [AnswerComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {

  @Input() pregunta!: Comentario;
  @Input() disabledButton: boolean = false;
  @Input() userId!: number;
  @Input() userRole!: string;

  @Output() recargarComentarios = new EventEmitter<void>();

  comentarioService = inject(ComentarioService);
  toastService = inject(ToastrService);

  respuestaDentista = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);

  disabledReponse = true;

  trackedQuestionId: number | null = null;

  showResponseBox(){
    this.disabledReponse = !this.disabledReponse;
    this.trackedQuestionId = this.pregunta.id;
  }
  comentar(){
    if (this.respuestaDentista.value != '' && this.userId) {
      this.comentarioService.createComentario(
        this.respuestaDentista.value ?? '',
        this.userId,
        this.trackedQuestionId
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.mensaje);
          this.respuestaDentista.reset();
          this.recargarComentarios.emit();
        },
        error: (error) => {
          console.log('Error durante el comentario:' + error.message);
        }
      })
    }
  }
}
