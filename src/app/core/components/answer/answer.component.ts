import { Component, Input } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent {
  @Input() respuesta!: Comentario;
}
