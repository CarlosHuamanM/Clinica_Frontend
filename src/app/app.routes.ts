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
import { GestionTipoDocumentoComponent } from './pages/gestion-tipo-documento/gestion-tipo-documento.component';
import { GestionTratamientoComponent } from './pages/gestion-tratamiento/gestion-tratamiento.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path:'iniciosesion' ,component: IniciosesionComponent},
    { path: 'registro', component: RegistroComponent},
    { path: 'tratamientos', component: TratamientosComponent},
    { path: 'blog', component: BlogComponent},
    { path: 'historial', component: HistorialComponent},
    { path: 'dashboard' ,component: DashboardComponent, children: [
        { path: 'reserva' ,component: ReservaComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        { path: 'historial' ,component: HistorialComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        { path: 'gestion-tipo-documento', component: GestionTipoDocumentoComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
        { path: 'gestion-tratamiento', component: GestionTratamientoComponent, canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}},
    ], canActivate: [roleGuard], data: {roles: ['PACIENTE', 'DENTISTA', 'ADMINISTRADOR']}}
];
