import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarpassComponent } from './cambiarpass.component';

describe('CambiarpassComponent', () => {
  let component: CambiarpassComponent;
  let fixture: ComponentFixture<CambiarpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
