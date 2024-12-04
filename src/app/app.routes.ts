import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { IniciosesionComponent } from './pages/iniciosesion/iniciosesion.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { roleGuard } from './core/guards/role.guard';
import { HistorialComponent } from './pages/historial/historial.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AgregarhorarioComponent } from './pages/agregarhorario/agregarhorario.component';
import { GestionCitasComponent } from './pages/gestion-citas/gestion-citas.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent, title: 'Clinica Dental Villegas' },
    {path:'iniciosesion' ,component: IniciosesionComponent, title: 'Inicio Sesion'},
    {path: 'registro', component: RegistroComponent, title: 'Registro'},
    {path: 'tratamientos', component: TratamientosComponent, title: 'Tratamientos'},
    {path: 'blog', component: BlogComponent, title: 'Blog'},
    {path: 'dashboard' ,component: DashboardComponent, title: 'Dashboard', children: [
        {path: 'reserva' ,component: ReservaComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        {path: 'historial' ,component: HistorialComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        {path: 'horarios' ,component: AgregarhorarioComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        {path: 'historial' ,component: HistorialComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        {path: 'administrador' ,component: AdministradorComponent, canActivate: [roleGuard], data: {roles: ['ADMINISTRADOR']}},
        {path: 'reportes' ,component: ReportesComponent, canActivate: [roleGuard], data: {roles: ['DENTISTA', 'ADMINISTRADOR']}},
        {path: 'agregarhorario' ,component: AgregarhorarioComponent, canActivate: [roleGuard], data: {roles: ['DENTISTA']}},
        {path: 'gestioncitas' ,component: GestionCitasComponent, canActivate: [roleGuard], data: {roles: ['DENTISTA']}},
    ], canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}}
];
