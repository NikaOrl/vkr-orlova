import { IStudent } from '../../groups/models/student.model';
import { IJob } from './jobs.model';
import { IMark } from './marks.model';
import { IModule } from './module.model';

export interface ITableData {
  students: IStudent[];
  marks: IMark[];
  jobs: IJob[];
}

export interface ITableDataFromBE extends ITableData {
  modules: IModule[];
}
