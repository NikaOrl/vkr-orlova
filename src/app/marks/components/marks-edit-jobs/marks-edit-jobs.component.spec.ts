import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RouterLinkStubDirective, RouterStub } from '../../../shared/utils/tests-stubs';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { MarksApiService } from '../../services/marks-api.service';
import { MarksApiServiceStub } from '../../services/marks-api.service.spec';
import { MarksEditJobsComponent } from './marks-edit-jobs.component';

describe('MarksEditJobsComponent', () => {
  let component: MarksEditJobsComponent;
  let fixture: ComponentFixture<MarksEditJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarksEditJobsComponent, RouterLinkStubDirective],
      providers: [
        { provide: MarksApiService, useClass: MarksApiServiceStub },
        { provide: Router, useClass: RouterStub },
      ],
      imports: [DragDropModule, ReactiveFormsModule, getTranslocoModule()],
    }).compileComponents();
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
