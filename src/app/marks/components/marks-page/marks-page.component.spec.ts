import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { MarksPageComponent } from './marks-page.component';

// tslint:disable-next-line:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {}

describe('MarksPageComponent', () => {
  let component: MarksPageComponent;
  let fixture: ComponentFixture<MarksPageComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MarksPageComponent, RouterOutletStubComponent],
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
