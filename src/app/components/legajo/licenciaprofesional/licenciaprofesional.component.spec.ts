import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaProfesionalComponent } from './licenciaprofesional.component';

describe('LicenciaProfesionalComponent', () => {
  let component: LicenciaProfesionalComponent;
  let fixture: ComponentFixture<LicenciaProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenciaProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenciaProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
