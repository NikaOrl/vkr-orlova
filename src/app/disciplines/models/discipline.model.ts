export interface IDisciplineBase {
  disciplineValue: string;
  semesterId: string;
  teacherIds: string[];
  attendanceWeight?: number;
  marksAreas: { three: number; four: number; five: number };
  countWithAttendance: boolean;
  countAsAverage: boolean;
}

export interface IDiscipline extends IDisciplineBase {
  id: string;
}
