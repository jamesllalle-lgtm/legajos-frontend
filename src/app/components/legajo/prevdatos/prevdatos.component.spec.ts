import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevdatosComponent } from './prevdatos.component';

describe('PrevdatosComponent', () => {
  let component: PrevdatosComponent;
  let fixture: ComponentFixture<PrevdatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevdatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevdatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
