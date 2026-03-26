import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoInvestigacionSemilleroComponent } from './grupo-investigacion-semillero.component';

describe('GrupoInvestigacionSemilleroComponent', () => {
  let component: GrupoInvestigacionSemilleroComponent;
  let fixture: ComponentFixture<GrupoInvestigacionSemilleroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoInvestigacionSemilleroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoInvestigacionSemilleroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
