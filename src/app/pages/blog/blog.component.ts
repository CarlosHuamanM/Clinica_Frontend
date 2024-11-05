import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

}
