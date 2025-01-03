import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../core/components/chart/chart.component';
import { ReporteService } from '../../core/services/reporte.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { CitaSexo } from '../../core/interfaces/cita-sexo';
import { CitaTipoTratamiento } from '../../core/interfaces/cita-tipo-tratamiento';
import { CitaCancelada } from '../../core/interfaces/cita-cancelada';
import { CitaDentista } from '../../core/interfaces/cita-dentista';
import { DataReport } from '../../core/interfaces/data-report';
import { error } from 'node:console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule, AsyncPipe, DatePipe, CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  authService = inject(AuthService);
  toastService = inject(ToastrService);
  userId!: number;
  userRole!: string;
  currentPageReport: number = 1;
  totalPagesReport: number = 1;
  paginatedReports: DataReport[] = [];

  dataCitasPorSexo: any;
  optionsCitasPorSexo: any;
  formCitasPorSexo = new FormGroup({
    startDate: new FormControl('2024-11-01', Validators.required),
    endDate: new FormControl('2024-12-12', Validators.required),
  });

  dataCitasPorTipoTratamiento: any;
  optionsCitasPorTipoTratamiento: any;
  formCitasPorTipoTratamiento = new FormGroup({
    startDate: new FormControl('2024-11-01', Validators.required),
    endDate: new FormControl('2024-12-12', Validators.required),
  });

  dataCitasCanceladas: any;
  optionsCitasCanceladas: any;
  formCitasCanceladas = new FormGroup({
    startDate: new FormControl('2024-11-01', Validators.required),
    endDate: new FormControl('2024-12-12', Validators.required),
  });

  dataCitasPorDentista!: Observable<CitaDentista[]>;
  formCitasPorDentista = new FormGroup({
    startDate: new FormControl('2024-11-01', Validators.required),
    endDate: new FormControl('2024-12-12', Validators.required),
    estado: new FormControl('Pendiente', Validators.required),
  });


  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();
    this.loadChartDataCitasPorSexo('2024-11-01', '2024-12-12');
    this.loadChartDataCitasPorTipoTratamiento('2024-11-01', '2024-12-12');
    this.loadChartDataCitasCanceladas('2024-11-01', '2024-12-12');
    this.loadDataCitasPorDentista('2024-11-01', '2024-12-12', 'Pendiente');
    this.loadDataReports();
  }
  constructor(private reporteService: ReporteService, private changeDetectorRef: ChangeDetectorRef) {
  }
  loadDataReports(): void {
    this.reporteService.getDataReports().subscribe((data) => {
      this.totalPagesReport = Math.ceil(data.length / 10);
      this.paginatedReports = this.paginate(data, this.currentPageReport, 10);
    });
  }
  paginate(data: any[], currentPage: number, pageSize: number): any[] {
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    return data.slice(start, end);
  }
  onPageChangeReport(page: number): void {
    if (page < 1 || page > this.totalPagesReport) return;
    this.currentPageReport = page;
    this.loadDataReports();
  }

  loadChartDataCitasPorSexo(startDate: string, endDate: string): void {
    this.reporteService.countCitasByDateAndSexo({ startDate, endDate }).subscribe({
      next: (data: CitaSexo[]) => {
        const masculinoData = data.find(d => d.sexo.toLowerCase() === 'masculino')?.total || 0;
        const femeninoData = data.find(d => d.sexo.toLowerCase() === 'femenino')?.total || 0;

        this.dataCitasPorSexo = {
          labels: ['Sexo'],
          datasets: [
            {
              label: 'Masculino',
              data: [masculinoData],
              backgroundColor: 'rgba(50, 168, 82)',
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 2
            },
            {
              label: 'Femenino',
              data: [femeninoData],
              backgroundColor: 'rgba(54, 209, 207)',
              borderColor: 'rgb(255, 255, 255)',
              borderWidth: 2
            }
          ]
        };

        this.optionsCitasPorSexo = {
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white',
              },
              border: {
                color: 'white'
              }
            },
            y: {
              title: {
                display: true,
                text: '# de citas',
                color: 'white'
              },
              ticks: {
                color: 'white',
              },
              beginAtZero: true
            }
          }
        };

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }

    }
    );
  }



  loadChartDataCitasPorTipoTratamiento(startDate: string, endDate: string): void {
    console.log(startDate, endDate);
    this.reporteService.countCitasByDateAndTipoTratamiento({ startDate, endDate }).subscribe({
      next: (data: CitaTipoTratamiento[]) => {
        const datasets = data.map((tratamiento, index) => ({
          label: tratamiento.tipoTratamiento,
          data: [tratamiento.total],
          backgroundColor: `hsl(${(index * 360) / data.length}, 70%, 60%)`,
          borderColor: 'rgb(255, 255, 255)',
          borderWidth: 2
        }));

        this.dataCitasPorTipoTratamiento = {
          labels: ['Tipos de tratamiento'],
          datasets
        };

        this.optionsCitasPorTipoTratamiento = {
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white',
              },
              border: {
                color: 'white'
              }
            },
            y: {
              title: {
                display: true,
                text: '# de citas',
                color: 'white'
              },
              ticks: {
                color: 'white',
              },
              beginAtZero: true
            }
          }
        };

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }

  loadChartDataCitasCanceladas(startDate: string, endDate: string): void {
    this.reporteService.countCitasCanceladasByFecha({ startDate, endDate }).subscribe({
      next: (data: CitaCancelada[]) => {
        const fechas = [...new Set(data.map(d => d.fecha))];
        const totales = data.map(d => d.total);
        this.dataCitasCanceladas = {
          labels: fechas,
          datasets: [
            {
              label: 'Canceladas',
              data: totales,
              backgroundColor: [
                'rgba(255, 99, 132, 0.4)',
                'rgba(255, 159, 64, 0.4)',
                'rgba(255, 205, 86, 0.4)',
                'rgba(75, 192, 192, 0.4)',
                'rgba(54, 162, 235, 0.4)',
                'rgba(153, 102, 255, 0.4)',
                'rgba(201, 203, 207, 0.4)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 2
            }
          ]
        }
        this.optionsCitasCanceladas = {
          scales: {
            x: {
              ticks: {
                color: 'black',
              },
              border: {
                color: 'black'
              }
            },
            y: {
              title: {
                display: true,
                text: '# de citas',
                color: 'black'
              },
              ticks: {
                color: 'black',
              },
              beginAtZero: true
            }
          }
        };
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }

  loadDataCitasPorDentista(startDate: string, endDate: string, estado: string): void {
    const queryparams = {
      startDate,
      endDate,
      estado
    };
    this.dataCitasPorDentista = this.reporteService.countCitasAtendidasPorDentista(queryparams);
  }

  downloadReportCitasPorSexo(startDate: string, endDate: string): void {
    const queryparams = {
      startDate,
      endDate,
      usuarioId: this.userId
    };
    this.reporteService.downloadReportCitasPorSexo(queryparams).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }
  downloadReportCitasPorTipo(startDate: string, endDate: string): void {
    const queryparams = {
      startDate,
      endDate,
      usuarioId: this.userId
    };
    this.reporteService.downloadReportCitasPorTipo(queryparams).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }
  downloadReportCitasCanceladas(startDate: string, endDate: string): void {
    const queryparams = {
      startDate,
      endDate,
      usuarioId: this.userId
    };
    this.reporteService.downloadReportCitasPorEstado(queryparams).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }
  downloadReportCitasPorDentista(startDate: string, endDate: string, estado: string): void {
    const queryparams = {
      startDate,
      endDate,
      estado,
      usuarioId: this.userId
    };
    this.reporteService.downloadReportCitasPorFecha(queryparams).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      },
      error: (error) => {
        this.toastService.error(error.error.message);
      }
    });
  }
  convertNumberToMonth(month: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month - 1];
  }
}