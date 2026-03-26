import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExpartarLegajoComponent } from './modal-expartar-legajo.component';

describe('ModalExpartarLegajoComponent', () => {
  let component: ModalExpartarLegajoComponent;
  let fixture: ComponentFixture<ModalExpartarLegajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExpartarLegajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExpartarLegajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
