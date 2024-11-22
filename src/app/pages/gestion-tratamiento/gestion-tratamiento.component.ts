import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { TipoTratamiento } from '../../core/interfaces/tipo-tratamiento';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-tratamiento',
  standalone: true,
  imports: [CommonModule, ModalComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './gestion-tratamiento.component.html',
  styleUrl: './gestion-tratamiento.component.css'
})
export class GestionTratamientoComponent implements OnInit {

  // Paginación de tratamientos
  currentPageTratamiento: number = 1;
  totalPagesTratamiento: number = 1;
  paginatedTratamientos: Tratamiento[] = [];

  tratamientos!: Observable<Tratamiento[]>;
  tiposTratamiento!: Observable<TipoTratamiento[]>;

  tratamientosService = inject(TratamientoService);
  toastService = inject(ToastrService);

  acccionFormulario: string = '';

  trackedTratamiento!: Tratamiento;

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  formBusqueda = new FormGroup({
    busqueda: new FormControl('')
  });

  formTratamiento = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    costo: new FormControl('', [Validators.required, Validators.min(0)]),
    tipoTratamientoId: new FormControl('', [Validators.required]),
    duracion: new FormControl('', [Validators.required]),
    imagenURL: new FormControl('')
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.tratamientosService.getTratamientos().subscribe((data) => {
      this.totalPagesTratamiento = Math.ceil(data.length / 3);
      this.paginatedTratamientos = this.paginate(data, this.currentPageTratamiento, 3);
    });
    this.tiposTratamiento = this.tratamientosService.getTiposTratamientos();
  }
  loadDataWithParams(params: any): void {
    this.tratamientosService.getTratamientos(params).subscribe((data) => {
      this.totalPagesTratamiento = Math.ceil(data.length / 3);
      this.paginatedTratamientos = this.paginate(data, this.currentPageTratamiento, 3);
    });
    this.tiposTratamiento = this.tratamientosService.getTiposTratamientos();
  }

  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  onPageChangeTratamiento(page: number): void {
    if (page < 1 || page > this.totalPagesTratamiento) return;
    this.currentPageTratamiento = page;
    this.loadData();
  }

  onChangeBusqueda(event: Event) {
    const target = event.target as HTMLInputElement;
    const busqueda = target.value;
    if (busqueda == '') {
      this.loadData();
      return;
    }
    this.loadDataWithParams({
      nombre: busqueda
    });
  }
  openModalToCreate(){
    this.formTratamiento.reset();
    this.acccionFormulario = 'Crear';
    this.modal.open();
  }
  openModalToUpdate(tratamiento: Tratamiento){
    this.acccionFormulario = 'Editar';
    this.trackedTratamiento = tratamiento;
    this.formTratamiento.patchValue({
      nombre: tratamiento.nombre,
      descripcion: tratamiento.descripcion,
      costo: tratamiento.costo.toString(),
      tipoTratamientoId: tratamiento.tipoTratamiento.id.toString(),
      duracion: this.convertirDuracionAMinutos(tratamiento.duracion).toString(),
      imagenURL: tratamiento.imagenURL
    })
    this.modal.open();
  }
  openModalToDelete(tratamiento: Tratamiento){
    this.trackedTratamiento = tratamiento;
    this.modalDelete.open();
  }


  guardarTratamiento(){
    this.tratamientosService.createTratamiento(this.formTratamiento.value).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.modal.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    });
  }
  actualizarTratamiento(){
    this.tratamientosService.updateTratamiento(this.trackedTratamiento.id, this.formTratamiento.value).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.modal.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    });
  }
  eliminarTratamiento(){
    this.tratamientosService.deleteTratamiento(this.trackedTratamiento.id).subscribe({
      next: (data) => {
        this.toastService.success(data.mensaje);
        this.modalDelete.close();
        this.loadData();
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    });
  }

  convertirDuracionAMinutos(duracion: string): number {
    const horasRegex = /(\d+)H/; // Coincide con "XH" (e.g., 1H para 1 hora).
    const minutosRegex = /(\d+)M/; // Coincide con "XM" (e.g., 30M para 30 minutos).
  
    let minutos = 0;
  
    // Extrae y convierte las horas a minutos.
    const horasMatch = duracion.match(horasRegex);
    if (horasMatch) {
      minutos += parseInt(horasMatch[1], 10) * 60;
    }
  
    // Extrae y suma los minutos.
    const minutosMatch = duracion.match(minutosRegex);
    if (minutosMatch) {
      minutos += parseInt(minutosMatch[1], 10);
    }
  
    return minutos;
  }
}
