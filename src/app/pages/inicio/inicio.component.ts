import { Component } from '@angular/core';
import { Router, RouterLink,RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NavbarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(public router: Router) {}
}

