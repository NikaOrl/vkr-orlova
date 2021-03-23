import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GroupPageComponent } from './group-page.component';
import { MockComponents } from 'ng-mocks';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

describe('GroupPageComponent', () => {
  let component: GroupPageComponent;
  let fixture: ComponentFixture<GroupPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupPageComponent, MockComponents(HeaderComponent)],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
