import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccioncienciainvestigacionComponent } from './produccioncienciainvestigacion.component';

describe('ProduccioncienciainvestigacionComponent', () => {
  let component: ProduccioncienciainvestigacionComponent;
  let fixture: ComponentFixture<ProduccioncienciainvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccioncienciainvestigacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccioncienciainvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
