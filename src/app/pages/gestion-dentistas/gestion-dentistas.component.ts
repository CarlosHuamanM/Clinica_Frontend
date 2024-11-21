import { Component, inject, OnInit } from '@angular/core';
import { Dentista } from '../../core/interfaces/dentista';
import { Observable } from 'rxjs';
import { DentistaService } from '../../core/services/dentista.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-dentistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-dentistas.component.html',
  styleUrl: './gestion-dentistas.component.css'
})
export class GestionDentistasComponent implements OnInit {
  // Paginación de dentistas
  currentPageDentista: number = 1;
  totalPagesDentista: number = 1;
  paginatedDentistas: Dentista[] = [];

  Dentistas!: Observable<Dentista[]>;
  DentistasService = inject(DentistaService);

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
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

  // Función para cambiar de página para Dentistas
  onPageChangeDentista(page: number): void {
    if (page < 1 || page > this.totalPagesDentista) return;
    this.currentPageDentista = page;
    this.loadData(); // Recargar los datos para la nueva página
  }
}
