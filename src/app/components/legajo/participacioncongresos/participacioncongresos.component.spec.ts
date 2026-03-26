import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacioncongresosComponent } from './participacioncongresos.component';

describe('ParticipacioncongresosComponent', () => {
  let component: ParticipacioncongresosComponent;
  let fixture: ComponentFixture<ParticipacioncongresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipacioncongresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacioncongresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
