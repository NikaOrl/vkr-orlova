import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
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
export class MarksTableComponent implements OnInit {
  public ELEMENT_DATA: IStudentMark[] = [];

  public selectedGroup: IGroup;
  public groups: IGroup[];
  public filteredGroups: IGroup[];
  public groupSelectValue: string | IGroup;

  public columns: IColumn[];
  public maxPointFuilds: IColumn[];
  public moduleFuilds: IColumn[];

  public displayedModulesColumns: string[];
  public displayedColumns: string[];
  public displayedMaxPointColumns: string[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource(this.ELEMENT_DATA);
  public marksAreas: IDialogData = { three: 60, four: 75, five: 90 };
  public maxAttendance: number = 0;
  public attendanceWeight: number = 1;
  public countWithAttendance: boolean = false;

  public editLink: string = '';
  public selectedDisciplineId: string;

  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild('scroller') public scroller: ElementRef;
  @ViewChild('table') public table: ElementRef;

  private jobs: IJob[] = [];
  private modules: IModule[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: MarksApiService,
    public dialog: MatDialog
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

    this.api.getGroups().subscribe(groups => {
      this.groups = groups;
      const selectedGroupId: string = this.route.snapshot.paramMap.get('groupId');
      this.selectedGroup = selectedGroupId ? this.groups.find(d => d.id === selectedGroupId) : this.groups[0];
      this.filteredGroups = this.groups;
      this.groupSelectValue = this.selectedGroup?.groupNumber ? this.selectedGroup.groupNumber.toString() : '';
      this.getMarks();
    });
  }

  public scrollTop(): void {
    this.table.nativeElement.scrollTo(this.scroller.nativeElement.scrollLeft, 0);
  }

  public scrollBottom(): void {
    this.scroller.nativeElement.scrollTo(this.table.nativeElement.scrollLeft, 0);
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

  public onSelectChange(): void {
    this.router.navigate([`/marks/${this.selectedDisciplineId}/${this.selectedGroup.id}`]);
    this.getMarks();
  }

  public parseGetMarksResult(result: ITableDataFromBE): IStudentMark[] {
    const marksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentMarks: IMark[] = result.jobs.map(job => job.marks.find(mark => mark.studentId === student.id));
      const markObject: { [key: number]: IMark } = {};
      studentMarks.forEach(mark => {
        const jobIndex: number = result.jobs.findIndex(job => mark.jobId === job.id);
        markObject[jobIndex] = mark;
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        attendance: `${student.attendance}`,
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  public getMarks(): void {
    if (this.selectedDisciplineId && this.selectedGroup) {
      this.editLink = `/marks/edit/${this.selectedDisciplineId}/${this.selectedGroup.id}`;

      this.api.getMarks(this.selectedDisciplineId, this.selectedGroup.id).subscribe(
        res => {
          this.maxAttendance = res.maxAttendance;
          this.attendanceWeight = res.attendanceWeight;
          this.countWithAttendance = res.countWithAttendance;
          this.ELEMENT_DATA = this.parseGetMarksResult(res);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.jobs = res.jobs;
          this.modules = res.modules;
          const { jobs, modules }: { jobs: IJob[]; modules: TableModule[] } = this.orderedByModuleJobs;
          this.moduleFuilds = modules.map(row => {
            return {
              columnDef: index => `module-${index}`,
              header: `${row.moduleName}`,
              number: row.numberOfJobs,
              cell: () => null,
            };
          });

          this.maxPointFuilds = jobs.map(row => {
            return {
              columnDef: index => `maxPoint-${index}`,
              header: `${row.maxPoint}`,
              cell: () => null,
            };
          });

          this.columns = jobs.map((row, index) => {
            return {
              columnDef: columnIndex => `${row.jobValue}-${columnIndex}`,
              header: `${row.jobValue}`,
              cell: cellRow => {
                if (!cellRow[index] || !cellRow[index].markValue) {
                  return null;
                }
                return cellRow[index].markValue;
              },
            };
          });
          this.displayedModulesColumns = this.countWithAttendance
            ? [
                'moduleFuild',
                'emptyHeader',
                'emptyHeader',
                ...this.moduleFuilds.map((x, i) => x.columnDef(i)),
                'emptyHeader',
                'emptyStickyEndHeader',
              ]
            : [
                'moduleFuild',
                'emptyHeader',
                ...this.moduleFuilds.map((x, i) => x.columnDef(i)),
                'emptyHeader',
                'emptyStickyEndHeader',
              ];
          this.displayedColumns = this.countWithAttendance
            ? [
                'studentName',
                'attendance',
                'attendancePoints',
                ...this.columns.map((x, i) => x.columnDef(i)),
                'sumPoints',
                'mark',
              ]
            : ['studentName', 'attendance', ...this.columns.map((x, i) => x.columnDef(i)), 'sumPoints', 'mark'];
          this.displayedMaxPointColumns = this.countWithAttendance
            ? [
                'maxPointFuild',
                'maxAttendanceNumber',
                'maxAttendancePointsNumber',
                ...this.maxPointFuilds.map((x, i) => x.columnDef(i)),
                'maxPointsSum',
                'maxPointsResult',
              ]
            : [
                'maxPointFuild',
                'maxAttendanceNumber',
                ...this.maxPointFuilds.map((x, i) => x.columnDef(i)),
                'maxPointsSum',
                'maxPointsResult',
              ];

          this.dataSource.sort = this.sort;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  public getSumPoints(element: IMark[], attendance: number): number {
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

  public getResultCellMark(element: IMark[], attendance: number): string {
    const sumPoints: number = this.getSumPoints(element, attendance);
    return this.getResultMark(sumPoints);
  }

  public getResultMaxMark(): string {
    const sumPoints: number = this.getSumMaxPoints();
    return this.getResultMark(sumPoints);
  }

  public getResultMark(sumPoints: number): string {
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

  public filterGroups(): void {
    const filterValue: string = this.displayGroupFn(this.groupSelectValue);
    this.filteredGroups = this.groups.filter(
      option => `${option.groupNumber}`.toLowerCase().indexOf(filterValue) === 0
    );
    this.groupSelectValue = filterValue;
  }

  public getAttendancePoints(attendance: number): number {
    return attendance * this.attendanceWeight;
  }

  public getMaxAttendancePointsNumber(): number {
    return this.maxAttendance * this.attendanceWeight;
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
}
