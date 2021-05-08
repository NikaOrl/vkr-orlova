import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { IMark } from '../../models/mark.model';
import { IJob } from '../../models/job.model';
import { IEditColumn } from '../../models/column.model';
import { ITableData, ITableDataJob, ITableDataStudent, TableModule } from '../../models/table-data.model';
import { IModule } from '../../models/module.model';

@Component({
  selector: 'app-marks-edit-table',
  templateUrl: './marks-edit-table.component.html',
  styleUrls: ['./marks-edit-table.component.scss'],
})
export class MarksEditTableComponent implements OnInit {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;
  @Output() public setSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  public columns: IEditColumn[];
  public maxPointFuilds: IEditColumn[];
  public moduleFuilds: IEditColumn[];

  public displayedModulesColumns: string[];
  public displayedColumns: string[];
  public displayedMaxPointColumns: string[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;

  private ELEMENT_DATA: IStudentMark[] = [];

  private modules: IModule[] = [];
  private jobs: ITableDataJob[] = [];
  private students: ITableDataStudent[];

  private addedJobsNumber: number = 0;

  constructor(private router: Router, private api: MarksApiService) {}

  public ngOnInit(): void {
    this.getMarks();
  }

  set saved(value: boolean) {
    this.setSaved.emit(value);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public markChange(e: number, jobId: string, ind: number): void {
    this.saved = false;
    this.jobs = this.jobs.map(a => ({
      ...a,
      marks: a.marks.map((mark, index) =>
        ind === index && mark.jobId === jobId ? { ...mark, markValue: `${e}` } : mark
      ),
    }));
  }

  public jobChange(e: string, jobNumber: number): void {
    this.saved = false;
    this.jobs[jobNumber].jobValue = e;
  }

  public maxPointChange(e: number, jobNumber: number): void {
    this.saved = false;
    this.jobs[jobNumber].maxPoint = e;
  }

  public save(): void {
    if (!this.saved) {
      this.api.updateMarks(this.jobs).subscribe(res => {
        this.saved = true;
        if (document.activeElement.id === 'redirect-button') {
          this.router.navigate([`/marks/${this.selectedDisciplineId}/${this.selectedGroupId}`]);
        }
      });
    } else {
      alert('no changes to save!');
    }
  }

  public delete(e: string): void {
    this.saved = false;
    this.jobs[this.jobs.findIndex(job => job.id === e)].deleted = true;

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public add(): void {
    this.saved = false;
    this.addedJobsNumber++;
    this.jobs.push({
      id: `${-this.addedJobsNumber}`,
      disciplineId: this.selectedDisciplineId,
      jobValue: `added-${this.addedJobsNumber}`,
      deleted: false,
      numberInList: 0,
      moduleId: this.modules[this.modules.length - 1].id,
      maxPoint: 0,
      marks: [
        ...this.students.map(student => ({
          id: null,
          studentId: student.id,
          jobId: `${-this.addedJobsNumber}`,
          markValue: '',
          deleted: false,
        })),
      ],
    });

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public cancelDelete(e: string): void {
    this.jobs[this.jobs.findIndex(job => job.id === e)].deleted = false;

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public cancelAdd(e: string): void {
    const index: number = this.jobs.findIndex(v => v.id === e);
    this.jobs.splice(index, 1);

    this.updateTableData({
      students: this.students,
      jobs: this.jobs,
    });
  }

  public isDeleted(e: string): boolean {
    return this.jobs[this.jobs.findIndex(job => job && job.id === e)].deleted;
  }

  public isAdded(e: string): boolean {
    return +this.jobs[this.jobs.findIndex(job => job && job.id === e)].id < 0;
  }

  public getMaxPoint(jobId: string): number {
    return this.jobs.find(job => job.id === jobId).maxPoint;
  }

  private getMarks(): void {
    this.api.getMarks(this.selectedDisciplineId, this.selectedGroupId).subscribe(
      res => {
        this.modules = res.modules.sort((m1, m2) => m1.numberInList - m2.numberInList);
        this.jobs = res.jobs.sort((j1, j2) => (j1.moduleId === j2.moduleId ? j1.numberInList - j2.numberInList : 0));
        this.students = res.students;
        this.updateTableData(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  private parseGetMarksResult(result: ITableData): IStudentMark[] {
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
        ...markObject,
      };
    });
    return marksAndStudents;
  }

  private updateTableData(dataObj: ITableData): void {
    this.ELEMENT_DATA = this.parseGetMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;

    const { jobs, modules }: { jobs: IJob[]; modules: TableModule[] } = this.orderedByModuleJobs;

    this.moduleFuilds = modules.map(row => {
      return {
        columnDef: index => `module-${index}`,
        header: `${row.moduleName}`,
        number: row.numberOfJobs,
        cell: () => null,
      };
    });

    this.columns = jobs.map(row => {
      return {
        columnDef: i => `${row.jobValue}-${i}`,
        header: `${row.jobValue}`,
        cell: (cellRow, jobId) => {
          const mark: string = cellRow[jobId] && cellRow[jobId].markValue;
          return mark && +mark ? +mark : null;
        },
        mark: cellRow => cellRow[`${row.id}`],
        jobId: row.id,
      };
    });
    this.maxPointFuilds = jobs.map(row => {
      return {
        columnDef: index => `maxPoint-${index}`,
        header: `${row.maxPoint}`,
        cell: () => {
          return null;
        },
        jobId: row.id,
      };
    });
    this.displayedModulesColumns = ['moduleFuild', ...this.moduleFuilds.map((x, i) => x.columnDef(i))];
    this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i))];
    this.displayedMaxPointColumns = ['maxPointHeader', ...this.maxPointFuilds.map((x, i) => x.columnDef(i))];
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
