import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldeclaracionjuradaComponent } from './modaldeclaracionjurada.component';

describe('ModaldeclaracionjuradaComponent', () => {
  let component: ModaldeclaracionjuradaComponent;
  let fixture: ComponentFixture<ModaldeclaracionjuradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaldeclaracionjuradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaldeclaracionjuradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
