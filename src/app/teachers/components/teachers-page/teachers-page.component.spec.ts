import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockComponents } from 'ng-mocks';

import { TeachersPageComponent } from './teachers-page.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

describe('TeachersPageComponent', () => {
  let component: TeachersPageComponent;
  let fixture: ComponentFixture<TeachersPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeachersPageComponent, MockComponents(HeaderComponent)],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
