import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Dentista } from '../../core/interfaces/dentista';
import { Observable } from 'rxjs';
import { DentistaService } from '../../core/services/dentista.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/interfaces/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-dentistas',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './gestion-dentistas.component.html',
  styleUrl: './gestion-dentistas.component.css'
})
export class GestionDentistasComponent implements OnInit {
  // Paginación de dentistas
  currentPageDentista: number = 1;
  totalPagesDentista: number = 1;
  paginatedDentistas: Dentista[] = [];

  // Paginación de usuarios
  currentPageUsuario: number = 1;
  totalPagesUsuario: number = 1;
  paginatedUsuarios: Usuario[] = [];


  Dentistas!: Observable<Dentista[]>;
  dentistasService = inject(DentistaService);
  usuarioService = inject(UsuarioService);
  toastService = inject(ToastrService);
  usuarios!: Observable<Usuario[]>;

  usuarioTracked!: Usuario;
  dentistaTracked!: Dentista;
  accionFormlario: string = '';

  @ViewChild('modalCreate') modalCreate!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  dentistaForm = new FormGroup({
    nColegiatura: new FormControl('', [Validators.minLength(5), Validators.maxLength(5)]),
    especialidad: new FormControl('', Validators.required),
    usuarioId: new FormControl('', Validators.required),
  })

  usuarioBusqueda = new FormGroup({
    nombre: new FormControl(''),
  });

  dentistaBusqueda = new FormGroup({
    nombre: new FormControl(''),
  });


  ngOnInit(): void {
    this.loadData();
    this.loadUsuarios();
  }
  loadData(): void {
    this.dentistasService.getDentistas().subscribe((data) => {
      this.totalPagesDentista = Math.ceil(data.length / 3);
      this.paginatedDentistas = this.paginate(data, this.currentPageDentista, 3);
    });
  }
  loadUsuarios(): void {
    this.usuarioService.getUsuarios(
      {
        rol: 'PACIENTE'
      }
    ).subscribe((data) => {
      this.totalPagesUsuario = Math.ceil(data.length / 3);
      this.paginatedUsuarios = this.paginate(data, this.currentPageUsuario, 3);
    });
  }

  // Función de paginación común
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }

  // Función para cambiar de página para Dentistas
  onPageChangeDentista(page: number): void {
    if (page < 1 || page > this.totalPagesDentista) return;
    this.currentPageDentista = page;
    this.loadData(); // Recargar los datos para la nueva página
  }
  onPageChangeUsuario(page: number): void {
    if (page < 1 || page > this.totalPagesUsuario) return;
    this.currentPageUsuario = page;
    this.loadUsuarios(); // Recargar los datos para la nueva página
  }
  setUsuarioTracked(usuario: Usuario){
    this.usuarioTracked = usuario;
    this.dentistaForm.get('usuarioId')?.setValue(usuario.id.toString());
    console.log(this.dentistaForm.get('usuarioId')?.value);
  }

  onChangeDentista(event: Event){
    const target = event.target as HTMLInputElement;
    const queryparams = {
      nombre: target.value
    };
    this.dentistasService.getDentistas(queryparams).subscribe((data) => {
      this.totalPagesDentista = Math.ceil(data.length / 3);
      this.paginatedDentistas = this.paginate(data, this.currentPageDentista, 3);
    });
  }

  openModalToCreate(){
    this.accionFormlario = 'Nuevo dentista';
    this.dentistaForm.reset();
    this.dentistaForm.get('nColegiatura')?.enable();
    this.modalCreate.open();
  }
  openModalToEdit(dentista: Dentista){
    this.accionFormlario = 'Editar dentista';
    this.dentistaTracked = dentista;
    this.dentistaForm.get('nColegiatura')?.disable();
    this.dentistaForm.patchValue({
      nColegiatura: dentista.ncolegiatura,
      especialidad: dentista.especializacion,
      usuarioId: dentista.usuarioId.toString(),
    });
    this.modalCreate.open();
  }
  openModalToDelete(dentista: Dentista){
    this.dentistaTracked = dentista;
    this.modalDelete.open();
  }
  
  registrarDentista(){
    const data = {
      ncolegiatura: this.dentistaForm.get('nColegiatura')?.value??'',
      especializacion: this.dentistaForm.get('especialidad')?.value??'',
      usuarioId: this.dentistaForm.get('usuarioId')?.value??'',
    };
    this.dentistasService.createDentista(data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadUsuarios();
        this.loadData();
        this.modalCreate.close();
      },
      error: (error) => {
        console.log('Error durante el registro:' + error.message);
        this.toastService.error('Error durante el registro: ' + error.message);
      }
    });
  }

  editarDentista(){
    const data = {
      ncolegiatura: this.dentistaForm.get('nColegiatura')?.value??'',
      especializacion: this.dentistaForm.get('especialidad')?.value??'',
      usuarioId: this.dentistaForm.get('usuarioId')?.value??'',
    };
    this.dentistasService.updateDentista(this.dentistaTracked.id, data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadUsuarios();
        this.loadData();
        this.modalCreate.close();
      },
      error: (error) => {
        console.log('Error durante el registro:' + error.message);
        this.toastService.error('Error durante el registro: ' + error.message);
      }
    });
  }

  eliminarDentista(){
    this.dentistasService.deleteDentista(this.dentistaTracked.id).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.loadUsuarios();
        this.loadData();
        this.modalDelete.close();
      },
      error: (error) => {
        console.log('Error durante el registro:' + error.message);
        this.toastService.error('Error durante el registro: ' + error.message);
      }
    });
  }
}
