import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Cita } from '../../core/interfaces/cita';
import { CitaService } from '../../core/services/cita.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './gestion-citas.component.html',
  styleUrl: './gestion-citas.component.css'
})
export class GestionCitasComponent implements OnInit {
  currentPageCita: number = 1;
  totalPagesCita: number = 1;
  paginatedCitas: Cita[] = [];

  citaService = inject(CitaService);
  authService = inject(AuthService);
  dentistaId!: number;
  trackedCita!: Cita;

  toastrService = inject(ToastrService);
  @ViewChild('modalAtender') modalAtender!: ModalComponent;
  @ViewChild('modalCancelar') modalCancelar!: ModalComponent;
  constructor() { }

  ngOnInit(): void {
    this.dentistaId = this.authService.getDentistaId();
    this.loadData();
  }
  loadData(): void {
    this.citaService.getCitas({dentistaId: this.dentistaId}).subscribe((data) => {
      this.totalPagesCita = Math.ceil(data.length / 5);
      this.paginatedCitas = this.paginate(data, this.currentPageCita, 5);
    });
  }
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  onPageChangeCita(page: number): void {
    if (page < 1 || page > this.totalPagesCita) return;
    this.currentPageCita = page;
    this.loadData(); // Recargar los datos para la nueva página
  }
  openModalToFocus(cita: Cita){
    this.trackedCita = cita;
    this.modalAtender.open();
  }
  openModalToCancel(cita: Cita){
    this.trackedCita = cita;
    this.modalCancelar.open();
  }
  atenderReserva(){
    this.citaService.successCita(this.trackedCita.id).subscribe({
      next: (response) => {
        this.modalAtender.close();
        this.toastrService.success(response.mensaje);
        this.loadData();
      },
      error: (error) => {
        this.modalAtender.close();
        this.toastrService.error(error.error.mensaje);
      }
    })
  }
  cancelarReserva(){
    this.citaService.deleteCita(this.trackedCita.id).subscribe({
      next: (response) => {
        this.modalCancelar.close();
        this.toastrService.success(response.mensaje);
        this.loadData();
      },
      error: (error) => {
        this.modalCancelar.close();
        this.toastrService.error(error.error.mensaje);
      }
    })
  }
}
