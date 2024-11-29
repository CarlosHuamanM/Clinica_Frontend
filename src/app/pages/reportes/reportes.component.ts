
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../core/components/chart/chart.component';
import { ReporteService } from '../../core/services/reporte.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CitaSexo } from '../../core/interfaces/cita-sexo';
import { CitaTipoTratamiento } from '../../core/interfaces/cita-tipo-tratamiento';
import { CitaCancelada } from '../../core/interfaces/cita-cancelada';
import { CitaDentista } from '../../core/interfaces/cita-dentista';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  authService = inject(AuthService);
  userId!: number;

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


  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadChartDataCitasPorSexo('2024-11-01', '2024-12-12');
    this.loadChartDataCitasPorTipoTratamiento('2024-11-01', '2024-12-12');
    this.loadChartDataCitasCanceladas('2024-11-01', '2024-12-12');
    this.loadDataCitasPorDentista('2024-11-01', '2024-12-12', 'Pendiente');
  }
  constructor(private reporteService: ReporteService, private changeDetectorRef: ChangeDetectorRef) {
  }

  loadChartDataCitasPorSexo(startDate: string, endDate: string): void {
    this.reporteService.countCitasByDateAndSexo({ startDate, endDate }).subscribe((data: CitaSexo[]) => {
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
    });
  }
  
  

  loadChartDataCitasPorTipoTratamiento(startDate: string, endDate: string): void {
    this.reporteService.countCitasByDateAndTipoTratamiento({ startDate, endDate }).subscribe((data: CitaTipoTratamiento[]) => {
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
    });
  }  
  

  loadChartDataCitasCanceladas(startDate: string, endDate: string): void {
    this.reporteService.countCitasCanceladasByFecha({ startDate, endDate }).subscribe((data: CitaCancelada[]) => {
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

  convertNumberToMonth(month: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month - 1];
  }

}

