import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-iniciosesion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './iniciosesion.component.html',
  styleUrl: './iniciosesion.component.css'
})
export class IniciosesionComponent {
  loginform= new FormGroup({
    email:new FormControl(''),
    password: new FormControl('')
  });

  guardar(){
    console.log(this.loginform.value)
  }
}
