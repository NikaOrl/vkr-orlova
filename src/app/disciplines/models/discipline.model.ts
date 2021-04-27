export interface IDisciplineBase {
  disciplineValue: string;
  semesterId: number;
  teacherIds: number[];
}
export interface IDiscipline extends IDisciplineBase {
  id: number;
}
