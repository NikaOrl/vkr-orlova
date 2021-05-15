import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { IGroup } from '../../../groups/models/group.model';
import { IStudent } from '../../../groups/models/student.model';
import { IColumn } from '../../models/column.model';
import { IDialogData } from '../../models/dialog-data.model';
import { IJob } from '../../models/job.model';
import { IMark } from '../../models/mark.model';
import { IModule } from '../../models/module.model';
import { IStudentMark } from '../../models/student-marks.model';
import { ITableDataFromBE, ITableDataJob, TableModule } from '../../models/table-data.model';
import { MarksApiService } from '../../services/marks-api.service';

@Component({
  selector: 'app-marks-table',
  templateUrl: './marks-table.component.html',
  styleUrls: ['./marks-table.component.scss'],
})
export class MarksTableComponent implements OnInit, AfterViewChecked {
  public ELEMENT_DATA: IStudentMark[] = [];

  public selectedGroup: IGroup;
  public groups: IGroup[];
  public filteredGroups: IGroup[];
  public groupSelectValue: string | IGroup;

  public columns: IColumn[];
  public maxPointFuilds: IColumn[];
  public moduleFuilds: IColumn[];

  public displayedModulesColumns: { def: string; hide: boolean }[];
  public displayedColumns: { def: string; hide: boolean }[];
  public displayedMaxPointColumns: { def: string; hide: boolean }[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource(this.ELEMENT_DATA);
  public maxAttendance: number = 0;
  public attendanceWeight: number = 1;
  public countWithAttendance: boolean = false;

  public editLink: string = '';
  public selectedDisciplineId: string;

  public showModules: FormControl = new FormControl();
  public showModulesResult: FormControl = new FormControl(false);

  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild('scroller') public scroller: ElementRef;
  @ViewChild('scroll') public scroll: ElementRef;
  @ViewChild('table') public table: ElementRef;

  private marksAreas: IDialogData;
  private jobs: ITableDataJob[] = [];
  private modules: IModule[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    private renderer: Renderer2,
    private translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = this.route.snapshot.paramMap.get('disciplineId');
    if (!this.selectedDisciplineId) {
      this.router.navigate([`/disciplines`]);
    }

    const showModulesResult: string = localStorage.getItem('showModulesResult');
    if (`${showModulesResult}` !== 'null' && `${showModulesResult}` !== 'undefined') {
      const showModulesResultByDisciplines: Record<string, boolean> = JSON.parse(showModulesResult);
      const disciplineShowModulesResult: boolean = showModulesResultByDisciplines[this.selectedDisciplineId];
      if (disciplineShowModulesResult) {
        this.showModulesResult.setValue(true);
      }
    }

    this.api.getGroups(this.selectedDisciplineId).subscribe(groups => {
      this.groups = groups;
      const selectedGroupId: string = this.route.snapshot.paramMap.get('groupId');
      this.selectedGroup = selectedGroupId ? this.groups.find(d => d.id === selectedGroupId) : this.groups[0];
      this.filteredGroups = this.groups;
      this.groupSelectValue = this.selectedGroup?.groupNumber ? this.selectedGroup.groupNumber.toString() : '';
      this.getMarks();
    });
  }

  public ngAfterViewChecked(): void {
    if (this.scroll && this.table) {
      this.renderer.setStyle(
        this.scroll.nativeElement,
        'width',
        `${this.table.nativeElement.children[0].offsetWidth}px`
      );
    }
  }

  public get hiddenModules(): IModule[] {
    return this.modules.filter(module => !this.showModules.value.some(m => (m ? m.id === module.id : true)));
  }

  public get isAuth(): boolean {
    const user: string = localStorage.getItem('currentUser');
    return !!user;
  }

  public switchShowModulesResult(e: MatSlideToggleChange): void {
    const showModulesResult: string = localStorage.getItem('showModulesResult');
    if (`${showModulesResult}` !== 'null' && `${showModulesResult}` !== 'undefined') {
      const showModulesResultByDisciplines: Record<string, boolean> = JSON.parse(showModulesResult);
      localStorage.setItem(
        'showModulesResult',
        JSON.stringify({ ...showModulesResultByDisciplines, [this.selectedDisciplineId]: e.checked })
      );
    } else {
      localStorage.setItem('showModulesResult', JSON.stringify({ [this.selectedDisciplineId]: e.checked }));
    }
    this.getMarks();
  }

  public scrollTop(): void {
    this.table.nativeElement.scrollTo(this.scroller.nativeElement.scrollLeft, 0);
  }

  public scrollBottom(): void {
    this.scroller.nativeElement.scrollTo(this.table.nativeElement.scrollLeft, 0);
    this.renderer.setStyle(this.scroll.nativeElement, 'width', `${this.table.nativeElement.children[0].offsetWidth}px`);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public selectGroup(group: IGroup): void {
    this.selectedGroup = group;
    this.onSelectChange();
  }

  public displayGroupFn(group: IGroup | string): string {
    if (group) {
      return (group as IGroup).groupNumber ? (group as IGroup).groupNumber.toString() : (group as string);
    }
    return '';
  }

  public getDisplayedColumns(columns: { def: string; hide: boolean }[]): string[] {
    if (columns) {
      return columns.filter(cd => !cd.hide).map(cd => cd.def);
    }
  }

  public getSumMaxPoints(): number {
    let sumPoints: number = 0;
    this.jobs.forEach((job: IJob) => {
      sumPoints += job.maxPoint;
    });
    if (this.countWithAttendance) {
      sumPoints += this.getMaxAttendancePointsNumber();
    }
    return sumPoints;
  }

  public getResultMaxMark(): string {
    const sumPoints: number = this.getSumMaxPoints();
    return this.getResultMark(sumPoints);
  }

  public filterGroups(): void {
    const filterValue: string = this.displayGroupFn(this.groupSelectValue);
    this.filteredGroups = this.groups.filter(
      option => `${option.groupNumber}`.toLowerCase().indexOf(filterValue) === 0
    );
    this.groupSelectValue = filterValue;
  }

  public getMaxAttendancePointsNumber(): number {
    return this.maxAttendance * this.attendanceWeight;
  }

  public showHideModules(): void {
    const hiddenModulesIdsString: string = localStorage.getItem('hiddenModulesIds');

    if (`${hiddenModulesIdsString}` !== 'null' && `${hiddenModulesIdsString}` !== 'undefined') {
      const hiddenModulesIds: Record<string, string[]> = JSON.parse(localStorage.getItem('hiddenModulesIds'));

      localStorage.setItem(
        'hiddenModulesIds',
        JSON.stringify({ ...hiddenModulesIds, [this.selectedDisciplineId]: this.hiddenModules.map(m => m.id) })
      );
    } else {
      localStorage.setItem(
        'hiddenModulesIds',
        JSON.stringify({ [this.selectedDisciplineId]: this.hiddenModules.map(m => m.id) })
      );
    }

    this.displayedModulesColumns = [
      { def: 'moduleFuild', hide: false },
      { def: 'emptyHeader', hide: this.maxAttendance === 0 },
      { def: 'emptyHeader', hide: !this.countWithAttendance || this.maxAttendance === 0 },
      ...this.moduleFuilds.map((x, i) => x.columnDef(i)),
      { def: 'emptyHeader', hide: false },
      { def: 'emptyStickyEndHeader', hide: false },
    ];
    this.displayedColumns = [
      { def: 'studentName', hide: false },
      { def: 'attendance', hide: this.maxAttendance === 0 },
      { def: 'attendancePoints', hide: !this.countWithAttendance || this.maxAttendance === 0 },
      ...this.columns.map((x, i) => x.columnDef(i)),
      { def: 'sumPoints', hide: false },
      { def: 'mark', hide: false },
    ];
    this.displayedMaxPointColumns = [
      { def: 'maxPointFuild', hide: false },
      { def: 'maxAttendanceNumber', hide: this.maxAttendance === 0 },
      { def: 'maxAttendancePointsNumber', hide: !this.countWithAttendance || this.maxAttendance === 0 },
      ...this.maxPointFuilds.map((x, i) => x.columnDef(i)),
      { def: 'maxPointsSum', hide: false },
      { def: 'maxPointsResult', hide: false },
    ];
  }

  private orderedByModuleJobs(students: IStudent[]): { jobs: ITableDataJob[]; modules: TableModule[] } {
    const orderedModules: TableModule[] = [];
    const orderedJobs: ITableDataJob[] = [];
    let lastModuleInListNumber: number = 0;
    this.modules.forEach(module => {
      if (module.numberInList > lastModuleInListNumber) {
        lastModuleInListNumber = module.numberInList;
      }
    });
    for (let i: number = 0; i <= lastModuleInListNumber; ++i) {
      const module: IModule = this.modules.find(m => m.numberInList === i);
      if (module) {
        const moduleJobs: ITableDataJob[] = this.jobs.filter(job => job.moduleId === module.id);
        if (this.showModulesResult.value) {
          moduleJobs.push({
            id: `${-i}`,
            disciplineId: null,
            moduleId: module.id,
            jobValue: this.translocoService.translateObject('marks.sumModulePoint'),
            deleted: false,
            maxPoint: moduleJobs.reduce((a, b) => a + (b.maxPoint || 0), 0), //  sum of jobs maxpoints
            marks: [
              ...students.map(row => ({
                id: null,
                studentId: row.id,
                jobId: `${-i}`,
                deleted: false,
                markValue: `${moduleJobs.reduce(
                  (a, b) => a + (+b.marks.find(m => m.studentId === row.id).markValue || 0),
                  0
                )}`,
              })),
            ],
            numberInList: moduleJobs.length + 1,
          });
        }

        const tableModule: TableModule = {
          ...module,
          numberOfJobs: moduleJobs.length,
        };
        orderedModules.push(tableModule);
        orderedJobs.push(...moduleJobs);
      }
    }
    return { jobs: orderedJobs, modules: orderedModules };
  }

  private onSelectChange(): void {
    this.router.navigate([`/marks/${this.selectedDisciplineId}/${this.selectedGroup.id}`]);
    this.getMarks();
  }

  private parseGetMarksResult(result: ITableDataFromBE): IStudentMark[] {
    const marksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentMarks: IMark[] = result.jobs.map(job => job.marks.find(mark => mark.studentId === student.id));
      const markObject: { [key: number]: IMark } = {};
      studentMarks.forEach(mark => {
        const jobV: IJob = result.jobs.find(job => mark && mark.jobId === job.id);
        if (jobV) {
          markObject[jobV.id] = mark;
        }
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        attendance: `${student.attendance}`,
        attendancePoints: `${this.getAttendancePoints(student.attendance)}`,
        sumPoints: `${this.getSumPoints(studentMarks, student.attendance)}`,
        resultCellMark: `${this.getResultCellMark(studentMarks, student.attendance)}`,
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  private getMarks(): void {
    if (this.selectedDisciplineId && this.selectedGroup) {
      this.editLink = `/marks/edit/${this.selectedDisciplineId}/${this.selectedGroup.id}`;

      this.api.getMarks(this.selectedDisciplineId, this.selectedGroup.id).subscribe(
        res => {
          this.maxAttendance = res.maxAttendance;
          this.attendanceWeight = res.attendanceWeight;
          this.countWithAttendance = res.countWithAttendance;
          this.marksAreas = res.marksAreas;
          this.jobs = res.jobs.sort((j1, j2) => (j1.moduleId === j2.moduleId ? j1.numberInList - j2.numberInList : 0));
          this.modules = res.modules.sort((m1, m2) => m1.numberInList - m2.numberInList);
          this.showModules.setValue(this.modules);

          const hiddenModulesIdsString: string = localStorage.getItem('hiddenModulesIds');
          if (`${hiddenModulesIdsString}` !== 'null' && `${hiddenModulesIdsString}` !== 'undefined') {
            const hiddenModulesIds: Record<string, string[]> = JSON.parse(localStorage.getItem('hiddenModulesIds'));
            const disciplineHiddenModulesIds: string[] = hiddenModulesIds[this.selectedDisciplineId];
            if (disciplineHiddenModulesIds && disciplineHiddenModulesIds.length > 0) {
              this.showModules.setValue(this.modules.filter(m => !disciplineHiddenModulesIds.find(id => id === m.id)));
            }
          }

          const { jobs, modules }: { jobs: ITableDataJob[]; modules: TableModule[] } = this.orderedByModuleJobs(
            res.students
          );
          this.ELEMENT_DATA = this.parseGetMarksResult(({
            students: res.students,
            jobs,
            modules,
          } as unknown) as ITableDataFromBE);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.moduleFuilds = modules.map(row => {
            return {
              columnDef: index => ({
                def: `module-${index}`,
                hide: this.showModules.value && !this.showModules.value.some(module => module && module.id === row.id),
              }),
              header: `${row.moduleName}`,
              number: row.numberOfJobs,
              cell: () => null,
            };
          });

          this.maxPointFuilds = jobs.map(row => {
            return {
              columnDef: index => ({
                def: `maxPoint-${index}`,
                hide:
                  this.showModules.value &&
                  !this.showModules.value.some(module => module && module.id === row.moduleId),
              }),
              header: `${row.maxPoint}`,
              cell: () => null,
            };
          });

          this.columns = jobs.map(row => {
            return {
              columnDef: columnIndex => ({
                def: `${row.jobValue}-${columnIndex}`,
                hide:
                  this.showModules.value &&
                  !this.showModules.value.some(module => module && module.id === row.moduleId),
              }),
              header: `${row.jobValue}`,
              cell: (cellRow, jobId) => {
                const mark: string = cellRow[jobId] && cellRow[jobId].markValue;
                return mark && +mark ? +mark : null;
              },
              jobId: row.id,
            };
          });
          this.showHideModules();
          this.dataSource.sort = this.sort;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  private getSumPoints(element: IMark[], attendance: number): number {
    let sumPoints: number = 0;
    let index: number = 0;
    let mark: IMark = element[index];
    while (mark !== undefined) {
      if (!isNaN(+mark.markValue)) {
        sumPoints += +mark.markValue;
      }
      if (mark.markValue === '+') {
        sumPoints += 1;
      }
      index++;
      mark = element[index];
    }
    if (this.countWithAttendance && attendance) {
      sumPoints += this.getAttendancePoints(attendance);
    }
    return sumPoints;
  }

  private getResultCellMark(element: IMark[], attendance: number): string {
    const sumPoints: number = this.getSumPoints(element, attendance);
    return this.getResultMark(sumPoints);
  }

  private getAttendancePoints(attendance: number): number {
    return attendance * this.attendanceWeight;
  }

  private getResultMark(sumPoints: number): string {
    if (this.marksAreas) {
      if (sumPoints < this.marksAreas.three) {
        return 'неуд.';
      } else if (sumPoints > this.marksAreas.three && sumPoints < this.marksAreas.four) {
        return 'удовл.';
      } else if (sumPoints > this.marksAreas.four && sumPoints < this.marksAreas.five) {
        return 'хор.';
      } else if (sumPoints > this.marksAreas.five) {
        return 'отл.';
      }
    }
  }
}
