import { Component, ElementRef, inject, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCardComponent } from "../user-card/user-card.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [UserCardComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  authService = inject(AuthService);
  userRole = "";
  userId = "";
  nombresUsuario = "";
  imagenPerfil = "";

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getUserId();
    this.nombresUsuario = this.authService.getNames();
    this.imagenPerfil = this.authService.getImagenPerfil();
  }

  @ViewChild('bodypd') bodypd!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('navbar') navBar!: ElementRef;
  @ViewChild('headertoggle') headerToggle!: ElementRef;
  @ViewChildren('navlink') navLinks!: ElementRef;

  constructor(private router:Router) {
    
  }

  showNavbar(){
      this.navBar.nativeElement.classList.toggle('show')
      this.headerToggle.nativeElement.classList.toggle('bx-x')
      this.bodypd.nativeElement.classList.toggle('body-pd')
      this.header.nativeElement.classList.toggle('body-pd')
  }

  removeToken(){
    localStorage.removeItem('token');
    this.router.navigate(['/'])
  }
}
