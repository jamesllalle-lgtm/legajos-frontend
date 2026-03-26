import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgeneralComponent } from './dgeneral.component';

describe('DgeneralComponent', () => {
  let component: DgeneralComponent;
  let fixture: ComponentFixture<DgeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
