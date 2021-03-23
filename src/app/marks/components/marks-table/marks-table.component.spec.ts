import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Directive, forwardRef, Component, Injectable } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { convertToParamMap, Router, ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { MarksTableComponent } from './marks-table.component';
import { MarksApiService } from '../../services/marks-api.service';
import { MatDialogModule } from '@angular/material/dialog';

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

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[cdkColumnDef]',
})
class CdkColumnDefStubDirective {
  @Input() public cdkColumnDef: any;
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

@Injectable()
export class MarksApiServiceStub {
  public getMarks(disciplineId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() =>
        resolve({
          marks: [
            { id: 1, markValue: '1' },
            { id: 2, markValue: '2' },
          ],
          jobs: [
            { id: 1, jobValue: 1 },
            { id: 2, jobValue: 2 },
          ],
          students: [{ id: 1 }, { id: 2 }],
        })
      );
      setTimeout(() => reject(new Error('ignored')));
    });
  }

  public getDisciplines(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() =>
        resolve({
          result: [
            { id: 1, disciplineValue: 'a' },
            { id: 2, disciplineValue: 'b' },
          ],
        })
      );
      setTimeout(() => reject(new Error('ignored')));
    });
  }
}

describe('MarksTableComponent', () => {
  let component: MarksTableComponent;
  let fixture: ComponentFixture<MarksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarksTableComponent,
        MatFormFieldStubComponent,
        MatLabelStubComponent,
        MatSelectStubComponent,
        MatOptionStubComponent,
        RouterLinkStubDirective,
        PlaceholderLabelStubDirective,
        NgxMatSelectSearchStubComponent,
        NoEntriesFoundLabelStubDirective,
        DataSourceStubDirective,
        MatHeaderRowDefStubDirective,
        MatRowDefColumnsStubDirective,
        CdkColumnDefStubDirective,
      ],
      imports: [
        FormsModule,
        // TODO: fix this import
        MatDialogModule,
      ],
      providers: [
        { provide: MarksApiService, useClass: MarksApiServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksTableComponent);
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

  it('should filter groups', () => {
    component.disciplines = [
      { id: 1, disciplineValue: 'a' },
      { id: 2, disciplineValue: 'b' },
    ];

    component.filterDisciplines('c');
    expect(component.filteredDisciplines).toEqual([]);
    component.selectedDiscipline = 1;
    component.onSelectedDisciplineChange();

    component.filterDisciplines('a');
    expect(component.filteredDisciplines).toEqual([{ id: 1, disciplineValue: 'a' }]);
  });
});
