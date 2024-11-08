import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciosesion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './iniciosesion.component.html',
  styleUrl: './iniciosesion.component.css'
})
export class IniciosesionComponent {

  authService = inject(AuthService);

  loginform= new FormGroup({
    correo:new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('')
  });
  constructor(private router: Router) { }

  login(){
    this.authService.login(this.loginform.get('correo')?.value ?? '',this.loginform.get('contrasena')?.value ?? '').subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/reserva']);
      },
      error: (error) => {
        console.log('Error durante el login:' + error.message);
        alert(error.message);
      }
    });
  }
}
