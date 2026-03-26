import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepCapacinvesComponent } from './rep-capacinves.component';

describe('RepCapacinvesComponent', () => {
  let component: RepCapacinvesComponent;
  let fixture: ComponentFixture<RepCapacinvesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepCapacinvesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepCapacinvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
