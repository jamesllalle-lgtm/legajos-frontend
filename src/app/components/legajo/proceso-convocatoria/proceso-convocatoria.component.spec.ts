import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoConvocatoriaComponent } from './proceso-convocatoria.component';

describe('ProcesoConvocatoriaComponent', () => {
  let component: ProcesoConvocatoriaComponent;
  let fixture: ComponentFixture<ProcesoConvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoConvocatoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
