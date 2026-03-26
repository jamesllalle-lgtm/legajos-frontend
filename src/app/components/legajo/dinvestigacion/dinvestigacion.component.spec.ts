import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinvestigacionComponent } from './dinvestigacion.component';

describe('DinvestigacionComponent', () => {
  let component: DinvestigacionComponent;
  let fixture: ComponentFixture<DinvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinvestigacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
