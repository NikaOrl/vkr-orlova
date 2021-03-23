import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockComponents } from 'ng-mocks';

import { MarksPageComponent } from './marks-page.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

describe('MarksPageComponent', () => {
  let component: MarksPageComponent;
  let fixture: ComponentFixture<MarksPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksPageComponent, MockComponents(HeaderComponent)],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
