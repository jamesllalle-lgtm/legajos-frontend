import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariopermisoComponent } from './usuariopermiso.component';

describe('UsuariopermisoComponent', () => {
  let component: UsuariopermisoComponent;
  let fixture: ComponentFixture<UsuariopermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariopermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariopermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
