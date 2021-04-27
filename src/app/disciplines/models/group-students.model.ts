export interface IDisciplineGroup {
  id: number; // group Id
  groupNumber: number;
  students: IDisciplineGroupStudent[];
}

interface IDisciplineGroupStudent {
  firstName: string;
  lastName: string;
  id: number;
  groupId: number;
  isInDiscipline: boolean;
}
