import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciadocenteComponent } from './experienciadocente.component';

describe('ExperienciadocenteComponent', () => {
  let component: ExperienciadocenteComponent;
  let fixture: ComponentFixture<ExperienciadocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperienciadocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciadocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
