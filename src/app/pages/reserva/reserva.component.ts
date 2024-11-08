import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit{

  @ViewChild('bodypd') bodypd!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('navbar') navBar!: ElementRef;
  @ViewChild('headertoggle') headerToggle!: ElementRef;
  @ViewChildren('navlink') navLinks!: ElementRef;

  constructor() { }

  ngOnInit() {
    
  }

  showNavbar(){
      this.navBar.nativeElement.classList.toggle('show')
      this.headerToggle.nativeElement.classList.toggle('bx-x')
      this.bodypd.nativeElement.classList.toggle('body-pd')
      this.header.nativeElement.classList.toggle('body-pd')
  }

}

