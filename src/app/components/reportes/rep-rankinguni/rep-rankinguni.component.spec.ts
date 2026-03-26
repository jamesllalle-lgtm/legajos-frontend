import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepRankinguniComponent } from './rep-rankinguni.component';

describe('RepRankinguniComponent', () => {
  let component: RepRankinguniComponent;
  let fixture: ComponentFixture<RepRankinguniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepRankinguniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepRankinguniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
