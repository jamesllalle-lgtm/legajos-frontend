import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinarizacionComponent } from './ordinarizacion.component';

describe('OrdinarizacionComponent', () => {
  let component: OrdinarizacionComponent;
  let fixture: ComponentFixture<OrdinarizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdinarizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdinarizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
