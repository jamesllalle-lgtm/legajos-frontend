import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyeccionsocialComponent } from './proyeccionsocial.component';

describe('ProyeccionsocialComponent', () => {
  let component: ProyeccionsocialComponent;
  let fixture: ComponentFixture<ProyeccionsocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyeccionsocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyeccionsocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
