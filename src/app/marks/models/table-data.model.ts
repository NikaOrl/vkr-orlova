import { IStudent } from '../../groups/models/student.model';
import { IJob } from './jobs.model';
import { IMark } from './marks.model';

export interface ITableData {
  students: IStudent[];
  marks: IMark[];
  jobs: IJob[];
}
