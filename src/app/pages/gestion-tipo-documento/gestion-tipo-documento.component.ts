import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TipoDocumento } from '../../core/interfaces/tipo-documento';
import { Observable } from 'rxjs';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-gestion-tipo-documento',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './gestion-tipo-documento.component.html',
  styleUrl: './gestion-tipo-documento.component.css'
})
export class GestionTipoDocumentoComponent implements OnInit {
  currentPageTipoDocumento: number = 1;
  totalPagesTipoDocumento: number = 1;
  paginatedTipoDocumentos: TipoDocumento[] = [];

  TipoDocumentos!: Observable<TipoDocumento[]>;
  TipoDocumentoService = inject(TipoDocumentoService);
  toastService = inject(ToastrService);
  accionFormulario: string = '';
  trackedTipoDocumento!: TipoDocumento;

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalDelete') modalDelete!: ModalComponent;

  busquedaForm = new FormGroup({
    busqueda: new FormControl('')
  })

  tipoDocumentoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    acronimo: new FormControl('', Validators.required),
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
      this.loadData();
  }
  loadData(): void {
    this.TipoDocumentoService.getTiposDocumento({}).subscribe((data) => {
      this.totalPagesTipoDocumento = Math.ceil(data.length / 3);
      this.paginatedTipoDocumentos = this.paginate(data, this.currentPageTipoDocumento, 3);
    });
  }
  loadDataWithParams(params: any): void {
    this.TipoDocumentoService.getTiposDocumento(params).subscribe((data) => {
      this.totalPagesTipoDocumento = Math.ceil(data.length / 3);
      this.paginatedTipoDocumentos = this.paginate(data, this.currentPageTipoDocumento, 3);
    });
  }
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  // Función para cambiar de página para TipoDocumentos
  onPageChangeTipoDocumento(page: number): void {
    if (page < 1 || page > this.totalPagesTipoDocumento) return;
    this.currentPageTipoDocumento = page;
    this.loadData(); // Recargar los datos para la nueva página
  }

  onChangeTipoDocumento(event: Event){
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

  openModalToCreate() {
    this.tipoDocumentoForm.reset();
    this.accionFormulario = 'Agregar ';
    this.modal.open();
  }

  openModalUdpate(tipoDocumento: TipoDocumento) {
    this.accionFormulario = 'Editar ';
    this.tipoDocumentoForm.patchValue({
      nombre : tipoDocumento.nombre,
      acronimo : tipoDocumento.acronimo,
    });
    this.modal.open();
  }
  openModalDelete(tipoDocumento: TipoDocumento) {
    this.accionFormulario = 'Eliminar ';
    this.trackedTipoDocumento = tipoDocumento;
    this.modalDelete.open();
  }

  registroTipoDocumento() {
    const data = {
      nombre: this.tipoDocumentoForm.get('nombre')?.value??'',
      acronimo: this.tipoDocumentoForm.get('acronimo')?.value??''
    };
    this.TipoDocumentoService.createTipoDocumento(data).subscribe({
        next: (response) => {
          this.toastService.success(response.mensaje);
          this.modal.close();
        },
        error: (error) => {
          console.log('Error durante el registro:' + error.message);
          this.toastService.error('Error durante el registro: ' + error.message);
        }
      });
  }

  actualizarTipoDocumento(id: number) {
    const data = {
      nombre: this.tipoDocumentoForm.get('nombre')?.value??'',
      acronimo: this.tipoDocumentoForm.get('acronimo')?.value??''
    };
    this.TipoDocumentoService.updateTipoDocumento(id, data).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.modal.close();
      },
      error: (error) => {
        console.log('Error durante la actualización:' + error.message);
        this.toastService.error('Error durante la actualización: ' + error.message);
      }
    });
  }

  eliminarTipoDocumento() {
    this.TipoDocumentoService.deleteTipoDocumento(this.trackedTipoDocumento.id).subscribe({
      next: (response) => {
        this.toastService.success(response.mensaje);
        this.modal.close();
      },
      error: (error) => {
        console.log('Error durante el borrado:' + error.message);
        this.toastService.error('Error durante el borrado: ' + error.message);
      }
    });
  }

}
