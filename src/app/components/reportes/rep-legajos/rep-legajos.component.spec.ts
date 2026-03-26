import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepLegajosComponent } from './rep-legajos.component';

describe('RepLegajosComponent', () => {
  let component: RepLegajosComponent;
  let fixture: ComponentFixture<RepLegajosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepLegajosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepLegajosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
