import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[routerLinkActiveOptions]',
})
// tslint:disable-next-line: directive-class-suffix
class RouterLinkActiveOptionsDirectiveStub {
  @Input('routerLinkActiveOptions') public linkParams: string;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, RouterLinkActiveOptionsDirectiveStub],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
