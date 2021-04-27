import { HttpHeaders } from '@angular/common/http';

export const HTTP_OPTIONS: Record<string, HttpHeaders> = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
export const API_PREFIX: string = '/api';
export const STUDENTS: string = `${API_PREFIX}/students`;
export const MARKS: string = `${API_PREFIX}/marks`;
export const TEACHERS: string = `${API_PREFIX}/teachers`;
export const GROUPS: string = `${API_PREFIX}/groups`;
export const DISCIPLINES: string = `${API_PREFIX}/disciplines`;
export const JOBS: string = `${API_PREFIX}/jobs`;
