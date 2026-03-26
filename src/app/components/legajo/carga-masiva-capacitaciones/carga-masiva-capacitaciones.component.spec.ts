import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaMasivaCapacitacionesComponent } from './carga-masiva-capacitaciones.component';

describe('CargaMasivaCapacitacionesComponent', () => {
  let component: CargaMasivaCapacitacionesComponent;
  let fixture: ComponentFixture<CargaMasivaCapacitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaMasivaCapacitacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaMasivaCapacitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
