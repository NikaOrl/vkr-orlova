import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';

import { MarksApiService } from '../../services/marks-api.service';
import { IStudentMark } from '../../models/student-marks.model';
import { IAttendance } from '../../models/attendance.model';
import { IStudent } from '../../../groups/models/student.model';
import { IEditColumn } from '../../models/column.model';
import { IAttendancesTableData, IAttendancesTableDataAttendance } from '../../models/table-data.model';
import { IAttendanceMark } from '../../models/attendance-mark.model';

@Component({
  selector: 'app-marks-edit-attendance',
  templateUrl: './marks-edit-attendance.component.html',
  styleUrls: ['./marks-edit-attendance.component.scss'],
})
export class MarksEditAttendanceComponent implements OnInit {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;
  @Output() public setSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  public columns: IEditColumn[];

  public displayedColumns: string[];

  public dataSource: MatTableDataSource<IStudentMark> = new MatTableDataSource([]);
  @ViewChild(MatSort) public sort: MatSort;

  private ELEMENT_DATA: IStudentMark[] = [];

  private attendances: IAttendancesTableDataAttendance[];
  private students: IStudent[];

  private addedAttendancesNumber: number = 0;

  constructor(private router: Router, private api: MarksApiService) {}

  public ngOnInit(): void {
    this.getAttendanceMarks();
  }

  set saved(value: boolean) {
    this.setSaved.emit(value);
  }

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public attendanceMarkChange(e: MatCheckbox, attendanceId: string, ind: number): void {
    this.saved = false;
    this.attendances = this.attendances.map(a => ({
      ...a,
      attendanceMarks: a.attendanceMarks.map((mark, index) =>
        ind === index && mark.attendanceId === attendanceId ? { ...mark, attendanceMarkValue: e.checked } : mark
      ),
    }));

    this.updateTableData({
      students: this.students,
      attendances: this.attendances,
    });
  }

  public attendanceChange(e: string, attendanceNumber: number): void {
    this.saved = false;
    this.attendances[attendanceNumber].attendanceName = e;
  }

  public save(): void {
    if (!this.saved) {
      this.api.updateAttendances(this.attendances).subscribe(res => {
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
    this.attendances[this.attendances.findIndex(attendance => attendance.id === e)].deleted = true;

    this.updateTableData({
      students: this.students,
      attendances: this.attendances,
    });
  }

  public add(): void {
    this.saved = false;
    this.addedAttendancesNumber++;
    this.attendances.push({
      id: `${-this.addedAttendancesNumber}`,
      disciplineId: this.selectedDisciplineId,
      attendanceName: `added-${this.addedAttendancesNumber}`,
      deleted: false,
      numberInList: 0,
      attendanceMarks: [
        ...this.students.map(student => ({
          id: null,
          studentId: student.id,
          attendanceId: `${-this.addedAttendancesNumber}`,
          attendanceMarkValue: false,
          deleted: false,
        })),
      ],
    });

    this.updateTableData({
      students: this.students,
      attendances: this.attendances,
    });
  }

  public cancelDelete(e: string): void {
    this.attendances[this.attendances.findIndex(attendance => attendance.id === e)].deleted = false;

    this.updateTableData({
      students: this.students,
      attendances: this.attendances,
    });
  }

  public cancelAdd(e: string): void {
    const index: number = this.attendances.findIndex(v => v.id === e);
    this.attendances.splice(index, 1);

    this.updateTableData({
      students: this.students,
      attendances: this.attendances,
    });
  }

  public isDeleted(e: string): boolean {
    return this.attendances[this.attendances.findIndex(attendance => attendance && attendance.id === e)].deleted;
  }

  public isAdded(e: string): boolean {
    return +this.attendances[this.attendances.findIndex(attendance => attendance && attendance.id === e)].id < 0;
  }

  private getAttendanceMarks(): void {
    this.api.getAttendanceMarks(this.selectedDisciplineId, this.selectedGroupId).subscribe(
      res => {
        this.attendances = [...res.attendances];
        this.students = res.students;
        this.updateTableData(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  private parseGetAttendanceMarksResult(result: IAttendancesTableData): IStudentMark[] {
    const attendanceMarksAndStudents: IStudentMark[] = result.students.map(student => {
      const studentAttendanceMarks: IAttendanceMark[] = result.attendances.map(attendance =>
        attendance.attendanceMarks.find(attendanceMark => attendanceMark.studentId === student.id)
      );
      const AttendanceMarkObject: { [key: number]: IAttendanceMark } = {};
      studentAttendanceMarks.forEach(AttendanceMark => {
        const attendanceV: IAttendance = result.attendances.find(
          attendance => AttendanceMark.attendanceId === attendance.id
        );
        if (attendanceV) {
          AttendanceMarkObject[attendanceV.id] = AttendanceMark;
        }
      });
      return {
        studentName: `${student.firstName} ${student.lastName}`,
        ...AttendanceMarkObject,
      };
    });
    return attendanceMarksAndStudents;
  }

  private updateTableData(dataObj: IAttendancesTableData): void {
    this.ELEMENT_DATA = this.parseGetAttendanceMarksResult(dataObj);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.columns = this.attendances.map((row, index) => {
      return {
        columnDef: i => `${row.attendanceName}-${i}`,
        header: `${row.attendanceName}`,
        cell: (cellRow, jobId) => {
          return cellRow[jobId].attendanceMarkValue;
        },
        attendanceMark: cellRow => cellRow[`${row.id}`],
        attendanceId: row.id,
      };
    });
    this.displayedColumns = ['studentName', ...this.columns.map((x, i) => x.columnDef(i))];
  }
}
