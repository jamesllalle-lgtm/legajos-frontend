import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluaciondesempComponent } from './evaluaciondesemp.component';

describe('EvaluaciondesempComponent', () => {
  let component: EvaluaciondesempComponent;
  let fixture: ComponentFixture<EvaluaciondesempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluaciondesempComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluaciondesempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
