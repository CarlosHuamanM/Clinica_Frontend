import { Component } from '@angular/core';
import { Router, RouterLink,RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(public router: Router, private http: HttpClient) { }
  
}

