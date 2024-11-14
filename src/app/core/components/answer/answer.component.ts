import { Component, Input } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent {
  @Input() respuesta!: Comentario;
}
