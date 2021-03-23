import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, forwardRef, Input, Directive, Injectable } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { TeachersEditComponent } from './teachers-edit.component';
import { TeachersApiService } from '../../services/teachers-api.service';
import { Teacher } from '../../models/teacher.model';
import { DialogService } from 'src/app/core/services/dialog.service';

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-form-field', template: '' })
class MatFormFieldStubComponent {}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-label', template: '' })
class MatLabelStubComponent {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-select',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectStubComponent),
      multi: true,
    },
  ],
})
class MatSelectStubComponent implements ControlValueAccessor {
  public value;
  public onChangeCallback;
  public onTouchedCallback;

  public writeValue(value: any): void {
    this.value = value;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (val?: any) => void): void {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: (val?: any) => void): void {
    this.onTouchedCallback = fn;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-checkbox',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatCheckboxStubComponent),
      multi: true,
    },
  ],
})
class MatCheckboxStubComponent implements ControlValueAccessor {
  public value;
  public onChangeCallback;
  public onTouchedCallback;

  public writeValue(value: any): void {
    this.value = value;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (val?: any) => void): void {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: (val?: any) => void): void {
    this.onTouchedCallback = fn;
  }
}

// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-option', template: '' })
class MatOptionStubComponent {
  @Input() public value: any;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-mat-select-search',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatSelectSearchStubComponent),
      multi: true,
    },
  ],
})
class NgxMatSelectSearchStubComponent {
  public value;
  public onChangeCallback;
  public onTouchedCallback;

  public writeValue(value: any): void {
    this.value = value;
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (val?: any) => void): void {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: (val?: any) => void): void {
    this.onTouchedCallback = fn;
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]',
  // tslint:disable-next-line:use-host-property-decorator
  host: { '(click)': 'onClick()' },
})
class RouterLinkStubDirective {
  @Input('routerLink') public linkParams: any;
  public navigatedTo: any = null;
  public onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[placeholderLabel]',
})
class PlaceholderLabelStubDirective {
  @Input('placeholderLabel') public linkParams: any;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[noEntriesFoundLabel]',
})
class NoEntriesFoundLabelStubDirective {
  @Input('noEntriesFoundLabel') public linkParams: any;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dataSource]',
})
class DataSourceStubDirective {
  @Input('dataSource') public linkParams: any;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[matHeaderRowDef]',
})
class MatHeaderRowDefStubDirective {
  @Input('matHeaderRowDef') public linkParams: any;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[matRowDefColumns]',
})
class MatRowDefColumnsStubDirective {
  @Input('matRowDefColumns') public linkParams: any;
}

@Injectable()
export class TeachersApiServiceStub {
  public getTeachers(groupId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: [{ id: 1 }, { id: 2 }] }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public updateTeachers(teachers: Teacher[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'test' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public addTeachers(teachers: Teacher[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'test' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public deleteTeachers(teachersIds: Set<number>): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ result: 'test' }));
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

@Injectable()
export class RouterStub {
  public navigate(path) {
    return {};
  }
}

@Injectable()
export class ActivatedRouteStub {
  get testParams() {
    return this._testParams;
  }
  set testParams(paramMap: {}) {
    this._testParams = paramMap;
    this.subject.next(paramMap);
  }
  public subject = new BehaviorSubject(this.testParams);

  public paramMap = this.subject.asObservable();

  public snapshot = {
    paramMap: convertToParamMap({ id: 1 }),
  };
  private _testParams: {};
}

describe('TeachersEditComponent', () => {
  let component: TeachersEditComponent;
  let fixture: ComponentFixture<TeachersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeachersEditComponent,
        MatFormFieldStubComponent,
        MatLabelStubComponent,
        MatSelectStubComponent,
        MatOptionStubComponent,
        MatCheckboxStubComponent,
        RouterLinkStubDirective,
        PlaceholderLabelStubDirective,
        NgxMatSelectSearchStubComponent,
        NoEntriesFoundLabelStubDirective,
        DataSourceStubDirective,
        MatHeaderRowDefStubDirective,
        MatRowDefColumnsStubDirective,
      ],
      imports: [FormsModule],
      providers: [
        DialogService,
        { provide: TeachersApiService, useClass: TeachersApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change dataSource.filter', () => {
    component.applyFilter('a');
    expect(component.dataSource.filter).toBe('a');
  });

  it('should save', async(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges(); // Run ngOnInit
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Pass data to the template
      component.save();

      component.add();
      expect(component.isAdded({ id: null })).toBe(true);
      expect(component.isAdded({ id: 2 })).toBe(false);

      component.delete({ id: 1 });
      expect(component.isDeleted({ id: 1 })).toBe(true);
      expect(component.isDeleted({ id: 2 })).toBe(false);
      component.unsaved();
      component.save();

      expect(component.canDeactivate()).toBe(true);
      component.cancelAdd({ id: null });

      component.cancelDelete({ id: 1 });
      expect(component.isDeleted({ id: 1 })).toBe(false);
    });
  }));
});
