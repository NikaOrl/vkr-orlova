export interface IMarksModule {
  id: string; // module Id
  moduleName: string;
  jobs: IMarksModuleJob[];
}

export interface IMarksModuleJob {
  id: string;
  jobValue: string;
  moduleId: string;
}
