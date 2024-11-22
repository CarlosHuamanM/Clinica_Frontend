import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  public config: any = {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [1, 2, 3],
          borderColor: '#36A2EB',
          backgroundColor: '#9BD0F5',
        },
        {
          label: 'Dataset 2',
          data: [2, 3, 4],
          borderColor: '#FF6384',
          backgroundColor: '#FFB1C1',
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  chart: any;
  isBrowser!:boolean
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
      if (this.isBrowser) {
        this.chart = new Chart('MyChart', this.config);
      }
  }

}
