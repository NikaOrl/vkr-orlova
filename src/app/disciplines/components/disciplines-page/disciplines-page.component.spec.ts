import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplinesPageComponent } from './disciplines-page.component';

describe('DisciplinesPageComponent', () => {
  let component: DisciplinesPageComponent;
  let fixture: ComponentFixture<DisciplinesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplinesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisciplinesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
