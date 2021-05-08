import { IStudent } from '../../groups/models/student.model';
import { IAttendanceMark } from './attendance-mark.model';
import { IAttendance } from './attendance.model';
import { IJob } from './job.model';
import { IMark } from './mark.model';
import { IModule } from './module.model';

export interface ITableData {
  students: ITableDataStudent[];
  jobs: ITableDataJob[];
}

export interface ITableDataJob extends IJob {
  marks: IMark[];
}

export interface ITableDataStudent extends IStudent {
  attendance: number;
}

export interface IAttendancesTableData {
  students: IStudent[];
  attendances: IAttendancesTableDataAttendance[];
}

export interface IAttendancesTableDataAttendance extends IAttendance {
  attendanceMarks: IAttendanceMark[];
}

export interface ITableDataFromBE extends ITableData {
  modules: IModule[];
  maxAttendance: number;
  attendanceWeight: number;
  countWithAttendance: boolean;
  marksAreas: { three: number; four: number; five: number };
}

export interface TableModule extends IModule {
  numberOfJobs: number;
}
