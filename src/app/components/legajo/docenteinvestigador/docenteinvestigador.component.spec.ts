import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteinvestigadorComponent } from './docenteinvestigador.component';

describe('DocenteinvestigadorComponent', () => {
  let component: DocenteinvestigadorComponent;
  let fixture: ComponentFixture<DocenteinvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenteinvestigadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteinvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
