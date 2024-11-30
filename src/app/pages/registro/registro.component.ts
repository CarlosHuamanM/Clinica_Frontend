import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../../core/interfaces/tipo-documento';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { ageValidator } from '../../core/validators/age.validator';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, AsyncPipe],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  providers: [DatePipe]
})
export class RegistroComponent implements OnInit {

  tiposDocumento!: Observable<TipoDocumento[]>;

  tipoDocumentoService = inject(TipoDocumentoService);
  authService = inject(AuthService);

  mostrarBotonDni = false;
  desactivarBotonDni = false;
  showPassword = false;

  codigoGenerado: string = '';
  codigoControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  @ViewChild('modal') modal!: ModalComponent;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    tipodocumento: new FormControl('', Validators.required),
    documento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidoPaterno: new FormControl('', Validators.required),
    apellidoMaterno: new FormControl('', Validators.required),
    fechanacimiento: new FormControl('', [Validators.required, ageValidator(18)]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern('^[0-9]*$')
    ]),
    contrasena: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', {validators: [this.passwordMatchValidator.bind(this)]}),
    sexo: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.registerForm.get('tipodocumento')?.valueChanges.subscribe(() => {
      this.onTipoDocumentoChange();
    });
    this.tiposDocumento = this.tipoDocumentoService.getTiposDocumento({});
  }


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.registerForm?.get('contrasena')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onTipoDocumentoChange() {
    const tipoDocumento = this.registerForm.get('tipodocumento')?.value;
    const documentoControl = this.registerForm.get('documento');

    if (tipoDocumento === 'DNI') {
      this.mostrarBotonDni = true;
      documentoControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
      ]);
    } else if (tipoDocumento === 'PASAPORTE') {
      documentoControl?.setValidators([
        Validators.required,
        Validators.maxLength(20)
      ]);
      this.mostrarBotonDni = false;
    } else {
      documentoControl?.clearValidators();
      this.mostrarBotonDni = false;
    }

    documentoControl?.updateValueAndValidity();
  }

  obtenerNombresApellidos(){
    this.desactivarBotonDni = true;
    this.authService.getNamesWithReniecService(this.registerForm.get('documento')?.value ?? '').subscribe({
      next: (response) => {
        this.registerForm.get('nombres')?.setValue(response.nombres);
        this.registerForm.get('apellidoPaterno')?.setValue(response.apellidoPaterno);
        this.registerForm.get('apellidoMaterno')?.setValue(response.apellidoMaterno);
      },
      error: (error) => {
        console.log('Error:' + error.message);
        alert(error.message);
      }
    });
    this.desactivarBotonDni = false;
  }

  enviarCodigoVerificacion(){
    this.authService.getCode(this.registerForm.get('email')?.value ?? '').subscribe({
      next: (response) => {
        console.log(response);
        this.codigoGenerado = response.code;
        this.modal.open();
      },
      error: (error) => {
        console.log('Error:' + error.message);
        alert(error.message);
      }
    });
  }

  verificarCodigo(){
    if(this.codigoControl.value === this.codigoGenerado){
      this.registrar();
    }else{
      alert('El código no es correcto');
    }
  }

  registrar() {
    this.authService.register(this.registerForm.get('email')?.value ?? '',
      this.registerForm.get('contrasena')?.value ?? '',
      this.registerForm.get('nombres')?.value ?? '',
      this.registerForm.get('tipodocumento')?.value ?? '',
      this.datePipe.transform(this.registerForm.get('fechanacimiento')?.value ?? '', 'yyyy-MM-dd') ?? '',
      this.registerForm.get('apellidoPaterno')?.value ?? '',
      this.registerForm.get('apellidoMaterno')?.value ?? '',
      this.registerForm.get('documento')?.value ?? '',
      this.registerForm.get('telefono')?.value ?? '',
      this.registerForm.get('sexo')?.value ?? '').subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard/reserva']);
      },
      error: (error) => {
        console.log('Error durante el registro:' + error.message);
        alert(error.message);
      }
    });
  }
}
