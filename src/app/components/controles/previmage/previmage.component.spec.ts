import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevimageComponent } from './previmage.component';

describe('PrevimageComponent', () => {
  let component: PrevimageComponent;
  let fixture: ComponentFixture<PrevimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevimageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
