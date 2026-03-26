import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaadministrativaComponent } from './cargaadministrativa.component';

describe('CargaadministrativaComponent', () => {
  let component: CargaadministrativaComponent;
  let fixture: ComponentFixture<CargaadministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaadministrativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaadministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
