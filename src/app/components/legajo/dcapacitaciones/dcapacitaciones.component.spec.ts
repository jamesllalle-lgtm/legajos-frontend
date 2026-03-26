import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcapacitacionesComponent } from './dcapacitaciones.component';

describe('DcapacitacionesComponent', () => {
  let component: DcapacitacionesComponent;
  let fixture: ComponentFixture<DcapacitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcapacitacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcapacitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
