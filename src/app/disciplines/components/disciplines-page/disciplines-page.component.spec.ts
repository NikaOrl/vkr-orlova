import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
      imports: [
        MatDialogModule,
        MatListModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule,
        getTranslocoModule(),
      ],
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
