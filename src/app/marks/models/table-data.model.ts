import { IStudent } from '../../groups/models/student.model';
import { IAttendanceMark } from './attendance-mark.model';
import { IAttendance } from './attendance.model';
import { IJob } from './job.model';
import { IMark } from './mark.model';

export interface ITableData {
  students: IStudent[];
  jobs: IJob[];
  marks: IMark[];
}

// export interface ITableDataJob extends IJob {
//   marks: IMark[];
// }

export interface IAttendancesTableData {
  students: IStudent[];
  attendances: IAttendancesTableDataAttendance[];
}

export interface IAttendancesTableDataAttendance extends IAttendance {
  attendanceMarks: IAttendanceMark[];
}

// export interface ITableDataFromBE extends ITableData {
//   modules: IModule[];
// }
