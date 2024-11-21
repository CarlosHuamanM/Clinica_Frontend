import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTipoDocumentoComponent } from './gestion-tipo-documento.component';

describe('GestionTipoDocumentoComponent', () => {
  let component: GestionTipoDocumentoComponent;
  let fixture: ComponentFixture<GestionTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTipoDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
