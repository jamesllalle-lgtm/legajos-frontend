import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionpsicologicaComponent } from './evaluacionpsicologica.component';

describe('EvaluacionpsicologicaComponent', () => {
  let component: EvaluacionpsicologicaComponent;
  let fixture: ComponentFixture<EvaluacionpsicologicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionpsicologicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionpsicologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
