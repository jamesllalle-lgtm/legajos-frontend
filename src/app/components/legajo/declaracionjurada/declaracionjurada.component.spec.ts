import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionjuradaComponent } from './declaracionjurada.component';

describe('DeclaracionjuradaComponent', () => {
  let component: DeclaracionjuradaComponent;
  let fixture: ComponentFixture<DeclaracionjuradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclaracionjuradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclaracionjuradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
