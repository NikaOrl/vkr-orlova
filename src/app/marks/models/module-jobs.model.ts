export interface IMarksModule {
  id: string; // module Id
  moduleName: string;
  jobs: IMarksModuleJob[];
  numberInList: number;
}

export interface IMarksModuleJob {
  id: string;
  jobValue: string;
  moduleId: string;
  numberInList: number;
}

export type IMarksTreeValues = IMarksModule | IMarksModuleJob;
