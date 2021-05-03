import { IJob } from './job.model';

export interface IColumn {
  columnDef: (index: number) => string;
  header: string;
  cell: (cellRow: IJob, studentIndex?: number) => number;
  mark?: (cellRow: IJob) => string;
  jobId?: string;
}
