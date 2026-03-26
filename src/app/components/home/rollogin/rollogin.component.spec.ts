import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolloginComponent } from './rollogin.component';

describe('RolloginComponent', () => {
  let component: RolloginComponent;
  let fixture: ComponentFixture<RolloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
