import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksEditJobsComponent } from './marks-edit-jobs.component';

describe('MarksEditJobsComponent', () => {
  let component: MarksEditJobsComponent;
  let fixture: ComponentFixture<MarksEditJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarksEditJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksEditJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
