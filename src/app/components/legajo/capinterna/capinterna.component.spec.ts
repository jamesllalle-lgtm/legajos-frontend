import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapinternaComponent } from './capinterna.component';

describe('CapinternaComponent', () => {
  let component: CapinternaComponent;
  let fixture: ComponentFixture<CapinternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapinternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapinternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
