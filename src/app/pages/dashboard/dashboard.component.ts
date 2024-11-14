import { Component } from '@angular/core';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  template: `
  <app-sidebar>
    <div dashboard-container>
        <router-outlet></router-outlet>
    </div>
  </app-sidebar>
`
})
export class DashboardComponent {

}
