import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacioninternaComponent } from './documentacioninterna.component';

describe('DocumentacioninternaComponent', () => {
  let component: DocumentacioninternaComponent;
  let fixture: ComponentFixture<DocumentacioninternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentacioninternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentacioninternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
