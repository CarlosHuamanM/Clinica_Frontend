import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarhorarioComponent } from './agregarhorario.component';

describe('AgregarhorarioComponent', () => {
  let component: AgregarhorarioComponent;
  let fixture: ComponentFixture<AgregarhorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarhorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarhorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
