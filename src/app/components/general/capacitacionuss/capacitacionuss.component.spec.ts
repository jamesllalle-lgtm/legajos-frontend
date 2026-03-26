import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionussComponent } from './capacitacionuss.component';

describe('CapacitacionussComponent', () => {
  let component: CapacitacionussComponent;
  let fixture: ComponentFixture<CapacitacionussComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitacionussComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitacionussComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
