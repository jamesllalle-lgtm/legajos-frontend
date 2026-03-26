import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuarioSinPermisoComponent } from './modal-usuario-sin-permiso.component';

describe('ModalUsuarioSinPermisoComponent', () => {
  let component: ModalUsuarioSinPermisoComponent;
  let fixture: ComponentFixture<ModalUsuarioSinPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUsuarioSinPermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUsuarioSinPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
