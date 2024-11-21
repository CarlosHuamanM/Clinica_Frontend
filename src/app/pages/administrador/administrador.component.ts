import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TipoDocumento } from '../../core/interfaces/tipo-documento';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { Dentista } from '../../core/interfaces/dentista';
import { DentistaService } from '../../core/services/dentista.service';
import { Observable  } from 'rxjs';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TipoTratamiento } from '../../core/interfaces/tipo-tratamiento';
import { PaginationService } from '../../core/services/pagination.service';
@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
    // Paginación de tipo documento
    currentPageTipoDocumento: number = 1;
    totalPagesTipoDocumento: number = 1;
    paginatedTipoDocumentos: TipoDocumento[] = [];
  
    // Paginación de tratamientos
    currentPageTratamiento: number = 1;
    totalPagesTratamiento: number = 1;
    paginatedTratamientos: Tratamiento[] = [];
  
    // Paginación de dentistas
    currentPageDentista: number = 1;
    totalPagesDentista: number = 1;
    paginatedDentistas: Dentista[] = [];
  
    // Datos obtenidos de servicios
    TipoDocumentos!: Observable<TipoDocumento[]>;
    Tratamientos!: Observable<Tratamiento[]>;
    Dentistas!: Observable<Dentista[]>;
  
    // Servicios e inyección
    TipoDocumentoService = inject(TipoDocumentoService);
    TratamientosService = inject(TratamientoService);
    DentistasService = inject(DentistaService);
    AuthService = inject(AuthService);
  
    ngOnInit(): void {
      this.loadData();
    }
  
    loadData(): void {
      this.TipoDocumentoService.getTiposDocumento().subscribe((data) => {
        this.totalPagesTipoDocumento = Math.ceil(data.length / 3); // Divide por 3 elementos por página
        this.paginatedTipoDocumentos = this.paginate(data, this.currentPageTipoDocumento, 3);
      });
  
      this.TratamientosService.getTratamientos().subscribe((data) => {
        this.totalPagesTratamiento = Math.ceil(data.length / 3);
        this.paginatedTratamientos = this.paginate(data, this.currentPageTratamiento, 3);
      });
  
      this.DentistasService.getDentistas().subscribe((data) => {
        this.totalPagesDentista = Math.ceil(data.length / 3);
        this.paginatedDentistas = this.paginate(data, this.currentPageDentista, 3);
      });
    }
  
    // Función de paginación común
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
  
    // Función para cambiar de página para Tratamientos
    onPageChangeTratamiento(page: number): void {
      if (page < 1 || page > this.totalPagesTratamiento) return;
      this.currentPageTratamiento = page;
      this.loadData(); // Recargar los datos para la nueva página
    }
  
    // Función para cambiar de página para Dentistas
    onPageChangeDentista(page: number): void {
      if (page < 1 || page > this.totalPagesDentista) return;
      this.currentPageDentista = page;
      this.loadData(); // Recargar los datos para la nueva página
    }
  }