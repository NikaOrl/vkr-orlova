import { IJob } from './job.model';

export interface IColumn {
  columnDef: (index: number) => { def: string; hide: boolean };
  header: string;
  cell: (cellRow: IJob, studentIndex?: number) => number;
  mark?: (cellRow: IJob) => string;
  jobId?: string;
}

export interface IEditColumn {
  columnDef: (index: number) => string;
  header: string;
  cell: (cellRow: IJob, studentIndex?: number) => number;
  mark?: (cellRow: IJob) => string;
  jobId?: string;
}
