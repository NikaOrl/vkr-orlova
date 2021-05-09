import { HttpHeaders } from '@angular/common/http';

export const HTTP_OPTIONS: Record<string, HttpHeaders> = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
export const API_PREFIX: string = '/api';
export const MARKS: string = `${API_PREFIX}/marks`;
export const MODULES: string = `${API_PREFIX}/modules`;
export const ATTENDANCES: string = `${API_PREFIX}/attendances`;
export const TEACHERS: string = `${API_PREFIX}/teachers`;
export const GROUPS: string = `${API_PREFIX}/groups`;
export const DISCIPLINES: string = `${API_PREFIX}/disciplines`;
export const SEMESTERS: string = `${API_PREFIX}/semesters`;
export const JOBS: string = `${API_PREFIX}/jobs`;
