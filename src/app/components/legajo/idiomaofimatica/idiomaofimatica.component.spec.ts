import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiomaofimaticaComponent } from './idiomaofimatica.component';

describe('IdiomaofimaticaComponent', () => {
  let component: IdiomaofimaticaComponent;
  let fixture: ComponentFixture<IdiomaofimaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdiomaofimaticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomaofimaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
