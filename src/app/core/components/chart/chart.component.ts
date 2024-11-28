import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { CitaService } from '../../services/cita.service';
import { ReporteService } from '../../services/reporte.service';
import { CitaPorMesDTO } from '../../interfaces/cita-por-mes-dto';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit, OnChanges {

  @Input({ required: true }) public type!: string;
  @Input({ required: true }) public data!: any;
  @Input() public options: any;

  chart: Chart | null = null;

  @ViewChild('mychart', { static: true }) mychart!: ElementRef<HTMLCanvasElement>;
  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['type'] || changes['options']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.mychart || !this.mychart.nativeElement) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: this.type as any,
      data: this.data,
      options: this.options,
    };

    const canvasElement = this.mychart.nativeElement;
    if (canvasElement) {
      this.chart = new Chart(canvasElement, config);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}
