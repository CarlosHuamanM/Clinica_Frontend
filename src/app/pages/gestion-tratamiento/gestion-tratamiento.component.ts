import { Component, inject, OnInit, viewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../../core/interfaces/tratamiento';
import { TratamientoService } from '../../core/services/tratamiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-tratamiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-tratamiento.component.html',
  styleUrl: './gestion-tratamiento.component.css'
})
export class GestionTratamientoComponent implements OnInit {

  // Paginación de tratamientos
  currentPageTratamiento: number = 1;
  totalPagesTratamiento: number = 1;
  paginatedTratamientos: Tratamiento[] = [];

  Tratamientos!: Observable<Tratamiento[]>;

  TratamientosService = inject(TratamientoService);



  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.TratamientosService.getTratamientos().subscribe((data) => {
      this.totalPagesTratamiento = Math.ceil(data.length / 3);
      this.paginatedTratamientos = this.paginate(data, this.currentPageTratamiento, 3);
    });
  }

  // Función de paginación común
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  // Función para cambiar de página para Tratamientos
  onPageChangeTratamiento(page: number): void {
    if (page < 1 || page > this.totalPagesTratamiento) return;
    this.currentPageTratamiento = page;
    this.loadData(); // Recargar los datos para la nueva página
  }
}
