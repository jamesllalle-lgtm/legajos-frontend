import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepCapacitacionesComponent } from './rep-capacitaciones.component';

describe('RepCapacitacionesComponent', () => {
  let component: RepCapacitacionesComponent;
  let fixture: ComponentFixture<RepCapacitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepCapacitacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepCapacitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
