export interface IDisciplineGroup {
  id: string; // group Id
  groupNumber: string;
  students: IDisciplineGroupStudent[];
}

export interface IDisciplineGroupStudent {
  firstName: string;
  lastName: string;
  id: string;
  groupId: string;
  isInDiscipline: boolean;
}
