import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedicacionComponent } from './dedicacion.component';

describe('DedicacionComponent', () => {
  let component: DedicacionComponent;
  let fixture: ComponentFixture<DedicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DedicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DedicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
