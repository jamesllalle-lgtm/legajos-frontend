import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajelegajoComponent } from './mensajelegajo.component';

describe('MensajelegajoComponent', () => {
  let component: MensajelegajoComponent;
  let fixture: ComponentFixture<MensajelegajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajelegajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajelegajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
