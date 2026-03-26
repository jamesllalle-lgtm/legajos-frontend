import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesorjuradotesisComponent } from './asesorjuradotesis.component';

describe('AsesorjuradotesisComponent', () => {
  let component: AsesorjuradotesisComponent;
  let fixture: ComponentFixture<AsesorjuradotesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsesorjuradotesisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsesorjuradotesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
