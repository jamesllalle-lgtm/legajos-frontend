import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlemoduleComponent } from './titlemodule.component';

describe('TitlemoduleComponent', () => {
  let component: TitlemoduleComponent;
  let fixture: ComponentFixture<TitlemoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitlemoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlemoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
