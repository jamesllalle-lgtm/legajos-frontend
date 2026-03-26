import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencianodocenteComponent } from './experiencianodocente.component';

describe('ExperiencianodocenteComponent', () => {
  let component: ExperiencianodocenteComponent;
  let fixture: ComponentFixture<ExperiencianodocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperiencianodocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencianodocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
