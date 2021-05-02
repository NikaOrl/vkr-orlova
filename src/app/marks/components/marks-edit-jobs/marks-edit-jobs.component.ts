import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IMarksModule, IMarksModuleJob } from '../../models/module-jobs.model';
import { MarksApiService } from '../../services/marks-api.service';

interface FormModule extends IMarksModule {
  formControlName?: string;
  isAdded?: boolean;
  isDeleted?: boolean;
}

@Component({
  selector: 'app-marks-edit-jobs',
  templateUrl: './marks-edit-jobs.component.html',
  styleUrls: ['./marks-edit-jobs.component.scss'],
})
export class MarksEditJobsComponent implements OnInit {
  @Input() public selectedGroupId: string;
  @Input() public selectedDisciplineId: string;
  @Output() public setSaved: EventEmitter<boolean> = new EventEmitter<boolean>();

  public connectedTo: string[] = [];
  public modules: FormModule[] = [];
  public jobsOutOfModule: IMarksModuleJob[] = [];

  public lastNumberInList: number = 0;
  public formSubmitAttempt: boolean = false;

  public modulesForm: FormGroup = new FormGroup({});

  constructor(private marksApiService: MarksApiService, private router: Router) {}

  public ngOnInit(): void {
    this.marksApiService.getModulesAndGroups(this.selectedDisciplineId, this.selectedGroupId).subscribe(data => {
      this.modules = data;
      for (const module of this.modules) {
        module.formControlName = `module-${module.id}`;
        this.modulesForm.addControl(`module-${module.id}`, new FormControl(module.moduleName, Validators.required));
        this.connectedTo.push(module.id);

        if (module.numberInList > this.lastNumberInList) {
          this.lastNumberInList = module.numberInList;
        }
      }
    });
  }

  set saved(value: boolean) {
    this.setSaved.emit(value);
  }

  public drop(event: CdkDragDrop<string[]>): void {
    this.saved = false;
    this.formSubmitAttempt = false;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public save(redirect?: boolean): void {
    this.formSubmitAttempt = true;
    const modulesToSend: IMarksModule[] = this.modules.map((m, index) => ({
      id: m.id.match('added-') ? null : m.id,
      numberInList: index,
      moduleName: this.modulesForm.get(this.getControl(m)).value,
      jobs: m.jobs.map((j, i) => ({ ...j, numberInList: i })),
      deleted: m.isDeleted,
    }));
    if (this.modulesForm.valid && !(this.jobsOutOfModule.length > 0)) {
      this.marksApiService
        .updateModulesAndGroups(this.selectedDisciplineId, this.selectedGroupId, modulesToSend)
        .subscribe(data => {
          this.saved = true;

          if (redirect) {
            this.router.navigate([`/marks/${this.selectedGroupId}/${this.selectedDisciplineId}`]);
          }
        });
    }
  }

  public saveAndClose(): void {
    this.save(true);
  }

  public add(): void {
    this.saved = false;
    this.formSubmitAttempt = false;

    this.lastNumberInList++;
    this.modulesForm.addControl(`module-added-${this.lastNumberInList}`, new FormControl('', Validators.required));
    this.modules.push({
      id: `added-${this.lastNumberInList}`,
      moduleName: '',
      jobs: [],
      numberInList: this.lastNumberInList,
      formControlName: `module-added-${this.lastNumberInList}`,
      isAdded: true,
    });
    this.connectedTo.push(`added-${this.lastNumberInList}`);
  }

  public cancelAdd(module: FormModule): void {
    this.lastNumberInList++;
    this.jobsOutOfModule.push(...module.jobs);
    this.modulesForm.removeControl(`module-${module.id}`);
    this.modules.splice(
      this.modules.findIndex(m => m.id === module.id),
      1
    );
    this.connectedTo.splice(
      this.connectedTo.findIndex(m => m === module.id),
      1
    );
  }

  public delete(module: FormModule): void {
    this.saved = false;
    this.formSubmitAttempt = false;

    this.jobsOutOfModule.push(...module.jobs);
    this.modules[this.modules.findIndex(m => m.id === module.id)].isDeleted = true;
  }

  public cancelDelete(module: FormModule): void {
    module.jobs.forEach(job => {
      this.jobsOutOfModule.splice(
        this.jobsOutOfModule.findIndex(j => j.id === job.id),
        1
      );
    });
    module.jobs = module.jobs.filter(
      job => !this.modules.some(m => m.id !== module.id && m.jobs.find(j => j.id === job.id))
    );
    this.modules[this.modules.findIndex(m => m.id === module.id)].isDeleted = false;
  }

  public getControl(module: FormModule): string {
    return `module-${module.id}`;
  }
}
