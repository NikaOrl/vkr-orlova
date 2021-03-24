import { HttpHeaders } from '@angular/common/http';

export const HTTP_OPTIONS: Record<string, HttpHeaders> = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
export const API_PREFIX: string = '/api';
export const STUDENTS: string = `${API_PREFIX}/students`;
export const MARKS: string = `${API_PREFIX}/marks`;
export const TEACHERS: string = `${API_PREFIX}/teachers`;
