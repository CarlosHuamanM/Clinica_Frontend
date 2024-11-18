import { Component, inject, OnInit } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  userRole = "";
  userId = 0;
  nombresUsuario = "";
  imagenPerfil = "";

  constructor(private router: Router) { }
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.nombresUsuario = this.authService.getNames();
    this.imagenPerfil = this.authService.getImagenPerfil();
  }
  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/iniciosesion']);
  }
}
