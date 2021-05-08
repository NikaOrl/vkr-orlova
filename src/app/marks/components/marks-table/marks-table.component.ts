import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { IDialogData } from '../../models/dialog-data.model';
import { IColumn } from '../../models/column.model';
import { ITableDataFromBE, TableModule } from '../../models/table-data.model';
import { IMark } from '../../models/mark.model';
import { IJob } from '../../models/job.model';
import { IGroup } from '../../../groups/models/group.model';
import { IModule } from '../../models/module.model';

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

  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild('scroller') public scroller: ElementRef;
  @ViewChild('scroll') public scroll: ElementRef;
  @ViewChild('table') public table: ElementRef;

  private marksAreas: IDialogData;
  private jobs: IJob[] = [];
  private modules: IModule[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = this.route.snapshot.paramMap.get('disciplineId');
    if (!this.selectedDisciplineId) {
      this.api.getDisciplines().subscribe(disciplines => {
        if (disciplines[0]) {
          this.selectedDisciplineId = disciplines[0].id;
          this.router.navigate([`/marks/${this.selectedDisciplineId}`]);
        }
      });
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

  private get orderedByModuleJobs(): { jobs: IJob[]; modules: TableModule[] } {
    const orderedModules: TableModule[] = [];
    const orderedJobs: IJob[] = [];
    let lastModuleInListNumber: number = 0;
    this.modules.forEach(module => {
      if (module.numberInList > lastModuleInListNumber) {
        lastModuleInListNumber = module.numberInList;
      }
    });
    for (let i: number = 0; i <= lastModuleInListNumber; ++i) {
      const module: IModule = this.modules.find(m => m.numberInList === i);
      if (module) {
        const moduleJobs: IJob[] = this.jobs.filter(job => job.moduleId === module.id);

        const tableModule: TableModule = { ...module, numberOfJobs: moduleJobs.length };
        orderedModules.push(tableModule);
        orderedJobs.push(...moduleJobs);
      }
    }
    return { jobs: orderedJobs, modules: orderedModules };
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
    this.displayedModulesColumns = [
      { def: 'moduleFuild', hide: false },
      { def: 'emptyHeader', hide: false },
      { def: 'emptyHeader', hide: !this.countWithAttendance },
      ...this.moduleFuilds.map((x, i) => x.columnDef(i)),
      { def: 'emptyHeader', hide: false },
      { def: 'emptyStickyEndHeader', hide: false },
    ];
    this.displayedColumns = [
      { def: 'studentName', hide: false },
      { def: 'attendance', hide: false },
      { def: 'attendancePoints', hide: !this.countWithAttendance },
      ...this.columns.map((x, i) => x.columnDef(i)),
      { def: 'sumPoints', hide: false },
      { def: 'mark', hide: false },
    ];
    this.displayedMaxPointColumns = [
      { def: 'maxPointFuild', hide: false },
      { def: 'maxAttendanceNumber', hide: false },
      { def: 'maxAttendancePointsNumber', hide: !this.countWithAttendance },
      ...this.maxPointFuilds.map((x, i) => x.columnDef(i)),
      { def: 'maxPointsSum', hide: false },
      { def: 'maxPointsResult', hide: false },
    ];
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
          this.ELEMENT_DATA = this.parseGetMarksResult(res);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.jobs = res.jobs.sort((j1, j2) => (j1.moduleId === j2.moduleId ? j1.numberInList - j2.numberInList : 0));
          this.modules = res.modules.sort((m1, m2) => m1.numberInList - m2.numberInList);
          this.showModules.setValue([{}, ...this.modules]);
          const { jobs, modules }: { jobs: IJob[]; modules: TableModule[] } = this.orderedByModuleJobs;
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
