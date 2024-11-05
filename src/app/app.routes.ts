import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { IniciosesionComponent } from './pages/login/iniciosesion/iniciosesion.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { TratamientosComponent } from './pages/tratamientos/tratamientos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    {path:'iniciosesion' ,component: IniciosesionComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'tratamientos', component: TratamientosComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'reserva' ,component: ReservaComponent}
];
