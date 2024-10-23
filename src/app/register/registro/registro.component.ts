import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup } from '@angular/forms';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registerform= new FormGroup({
    email:new FormControl(''),
    tipodocumento:new FormControl(''),
    fechanacimiento:new FormControl(''),
    documento:new FormControl(''),
    telefono:new FormControl(''),
    contraseña:new FormControl(''),
    genero:new FormControl('')
  });

  guardar(){
    console.log(this.registerform.value)
  }
}
