import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriadocenteComponent } from './categoriadocente.component';

describe('CategoriadocenteComponent', () => {
  let component: CategoriadocenteComponent;
  let fixture: ComponentFixture<CategoriadocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriadocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriadocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
