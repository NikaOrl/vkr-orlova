import { IStudent } from './student.model';

export interface IGroup {
  id?: string;
  groupNumber: string;
  students?: IStudent[];
}
