import { Component, ElementRef, inject, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCardComponent } from "../user-card/user-card.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,UserCardComponent, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  authService = inject(AuthService);
  userRole = "";
  userId = "";
  nombresUsuario = "";
  imagenPerfil = "";
  menuItems: Array<{ label: string, link: string, icon: string, roles: string[] }> = [];
  filteredMenuItems: Array<{ label: string, link: string, icon: string, roles: string[] }> = [];

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    console.log('Rol del usuario:', this.userRole);
    this.userId = this.authService.getUserId();
    this.nombresUsuario = this.authService.getNames();
    this.imagenPerfil = this.authService.getImagenPerfil();
    // Define los elementos del menú con roles permitidos
    this.menuItems = [
      { label: 'Reserva', link: '/dashboard/reserva', icon: 'bi bi-calendar3', roles: ["PACIENTE", 'DENTISTA' , "ADMINISTRADOR"] },
      { label: 'Historial', link: '/dashboard/historial', icon: 'bi bi-clock-history', roles: ["PACIENTE", "DENTISTA"] },
      { label: 'Administrador', link: '/dashboard/administrador', icon: 'bi bi-database-fill', roles: ["ADMINISTRADOR","DENTISTA"] },
      { label: 'Reportes', link: '/dashboard/reportes', icon: 'bi bi-file-earmark-bar-graph-fill', roles: ["DENTISTA", "ADMINISTRADOR"] },
      { label: 'Agregar Horario', link: '/dashboard/agregarhorario', icon: 'bi bi-calendar', roles: ["DENTISTA", "ADMINISTRADOR"] }
    ];
    this.filteredMenuItems = this.menuItems.filter(menu => menu.roles.includes(this.userRole));


  }

  @ViewChild('bodypd') bodypd!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('navbar') navBar!: ElementRef;
  @ViewChild('headertoggle') headerToggle!: ElementRef;
  @ViewChildren('navlink') navLinks!: ElementRef;

  constructor(private router: Router) {

  }

  showNavbar() {
    this.navBar.nativeElement.classList.toggle('show')
    this.headerToggle.nativeElement.classList.toggle('bx-x')
    this.bodypd.nativeElement.classList.toggle('body-pd')
    this.header.nativeElement.classList.toggle('body-pd')
  }

  removeToken() {
    localStorage.removeItem('token');
    this.router.navigate(['/'])
  }
}