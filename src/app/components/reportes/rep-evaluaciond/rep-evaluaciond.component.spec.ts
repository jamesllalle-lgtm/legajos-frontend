import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepEvaluaciondComponent } from './rep-evaluaciond.component';

describe('RepEvaluaciondComponent', () => {
  let component: RepEvaluaciondComponent;
  let fixture: ComponentFixture<RepEvaluaciondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepEvaluaciondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepEvaluaciondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
