import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TipoDocumento } from '../../core/interfaces/tipo-documento';
import { Observable } from 'rxjs';
import { TipoDocumentoService } from '../../core/services/tipo-documento.service';

@Component({
  selector: 'app-gestion-tipo-documento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-tipo-documento.component.html',
  styleUrl: './gestion-tipo-documento.component.css'
})
export class GestionTipoDocumentoComponent implements OnInit {
  // Paginación de tipo documento
  currentPageTipoDocumento: number = 1;
  totalPagesTipoDocumento: number = 1;
  paginatedTipoDocumentos: TipoDocumento[] = [];

  TipoDocumentos!: Observable<TipoDocumento[]>;
  TipoDocumentoService = inject(TipoDocumentoService);

  ngOnInit(): void {
      this.loadData();
  }
  loadData(): void {
    this.TipoDocumentoService.getTiposDocumento({}).subscribe((data) => {
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

}
