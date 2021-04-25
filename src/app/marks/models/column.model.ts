import { IJob } from './jobs.model';

export interface IColumn {
  columnDef: (index: number) => string;
  header: string;
  cell: (cellRow: IJob, studentIndex?: number) => string;
  mark?: (cellRow: IJob) => string;
  jobId?: number;
}
