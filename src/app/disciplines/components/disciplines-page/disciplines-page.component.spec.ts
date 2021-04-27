import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { RouterLinkStubDirective } from '../../../shared/utils/tests-stubs';
import { getTranslocoModule } from '../../../transloco/transloco-testing.module';
import { DisciplinesApiService } from '../../services/disciplines-api.service';
import { DisciplinesApiServiceStub } from '../../services/disciplines-api.service.spec';

import { DisciplinesPageComponent } from './disciplines-page.component';

describe('DisciplinesPageComponent', () => {
  let component: DisciplinesPageComponent;
  let fixture: ComponentFixture<DisciplinesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatListModule, getTranslocoModule()],
      declarations: [DisciplinesPageComponent, MockComponent(HeaderComponent), RouterLinkStubDirective],
      providers: [{ provide: DisciplinesApiService, useClass: DisciplinesApiServiceStub }],
    }).compileComponents();
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
