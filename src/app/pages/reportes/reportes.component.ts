
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../core/components/chart/chart.component';
import { CitaPorMesDTO } from '../../core/interfaces/cita-por-mes-dto';
import { ReporteService } from '../../core/services/reporte.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CitaPorTipoTratamientoDTO } from '../../core/interfaces/cita-por-tipo-tratamiento-dto';
import { ChartOptions } from 'chart.js';
import { CitaPorEstadoDTO } from '../../core/interfaces/cita-por-estado-dto';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  authService = inject(AuthService);
  userId!: number;

  dataCitasPorMes: any;
  optionsCitasPorMes: any;
  formCitasPorMes = new FormGroup({
      year: new FormControl(2024),
      month: new FormControl(11),
  });

  dataCitasPorTipoTratamiento: any;
  optionsCitasPorTipoTratamiento: any;
  formCitasPorTipoTratamiento = new FormGroup({
    year: new FormControl(2024),
    month: new FormControl(11),
  });

  dataCitasPorEstado: any;
  optionsCitasPorEstado: any;
  formCitasPorEstado = new FormGroup({
    year: new FormControl(2024),
    estado: new FormControl('Pendiente'),
  });

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadChartDataCitasPorMes(2024, 11);
    this.loadChartDataCitasPorTipoTratamiento(2024, 11);
    this.loadChartDataCitasPorEstado(2024, 'Pendiente');
  }
  constructor(private reporteService: ReporteService, private changeDetectorRef: ChangeDetectorRef) {
  }
  
  
  loadChartDataCitasPorMes(year:number, month: number): void {
    this.reporteService.getReportePorMesYSexo(year, month).subscribe((data: CitaPorMesDTO[]) => {
      const mesesLabels = [...new Set(data.map(d => this.convertNumberToMonth(d.mes)))];
      const meses = [...new Set(data.map(d => d.mes))];
      const masculinos = meses.map(mes => 
        data.find(d => d.mes === mes && d.sexo === 'MASCULINO')?.total || 0
      );
      const femeninos = meses.map(mes => 
        data.find(d => d.mes === mes && d.sexo === 'FEMENINO')?.total || 0
      );
      this.dataCitasPorMes = {
        labels: mesesLabels,
        datasets: [
          {
            label: 'Masculino',
            data: masculinos,
            backgroundColor: '#01cfc9',
            borderColor: 'white',
            borderWidth: 2
          },
          {
            label: 'Femenino',
            data: femeninos,
            backgroundColor: '#FFB1C1',
            borderColor: 'white',
            borderWidth: 2
          }
        ]
      }
      this.optionsCitasPorMes = {
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
      }
      this.changeDetectorRef.detectChanges();
    });
  }
  downloadChartDataCitasPorMes(year:number, month: number): void {
    this.reporteService.downloadReportePorMesYSexo(year, month, this.userId).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    )
  }

  loadChartDataCitasPorTipoTratamiento(year:number, month: number): void{
    this.reporteService.getReportePorTipoTratamiento(year, month).subscribe((data: CitaPorTipoTratamientoDTO[]) => {
      const tiposTratamiento = [...new Set(data.map(d => d.tipoTratamiento))];
      const totales = data.map(d => d.total);
      this.dataCitasPorTipoTratamiento = {
        labels: tiposTratamiento,
        datasets: [
          {
            label: 'Tratamientos',
            data: totales,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(255, 205, 86)'
            ],
            borderColor: [
              'rgb(255, 255, 255)'
            ],
            borderWidth: 2
          }
        ]
      }
      this.optionsCitasPorTipoTratamiento = {
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

  downloadChartDataCitasPorTipoTratamiento(year:number, month: number): void {
    this.reporteService.downloadReportePorTipoTratamiento(year, month, this.userId).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    )
  }

  loadChartDataCitasPorEstado(year:number, estado: string): void{
    this.reporteService.getReportePorEstadoCita(year, estado).subscribe((data: CitaPorEstadoDTO[]) => {
      const meses = [...new Set(data.map(d => this.convertNumberToMonth(d.mes)))];
      const totales = data.map(d => d.total);
      this.dataCitasPorEstado = {
        labels: meses,
        datasets: [
          {
            label: 'Estados',
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
      this.optionsCitasPorEstado = {
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

  downloadChartDataCitasPorEstado(year:number, estado: string): void {
    this.reporteService.downloadReportePorEstadoCita(year, estado, this.userId).subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    )
  }
  convertNumberToMonth(month: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[month - 1];
  }
}

