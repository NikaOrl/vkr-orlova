export interface IDisciplineBase {
  disciplineValue: string;
  semesterId: string;
  teacherIds: string[];
}
export interface IDiscipline extends IDisciplineBase {
  id: string;
}
