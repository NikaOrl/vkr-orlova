import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IMarksModule } from '../../models/module-jobs.model';
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

  public connectedTo: string[] = [];
  public modules: FormModule[] = [];

  public lastNumberInList: number = 0;

  public modulesForm: FormGroup = new FormGroup({});

  constructor(private marksApiService: MarksApiService) {}

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

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public save(): void {
    const modulesToSend: IMarksModule[] = this.modules.map((m, index) => ({
      id: m.id.match('added-') ? null : m.id,
      numberInList: index,
      moduleName: this.modulesForm.get(this.getControl(m)).value,
      jobs: m.jobs.map((j, i) => ({ ...j, numberInList: i })),
      deleted: m.isDeleted,
    }));
    if (this.modulesForm.valid) {
      this.marksApiService
        .updateModulesAndGroups(this.selectedDisciplineId, this.selectedGroupId, modulesToSend)
        .subscribe(data => {
          //
        });
    }
  }

  public add(): void {
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
    this.modules[this.modules.findIndex(m => m.id === module.id)].isDeleted = true;
  }

  public cancelDelete(module: FormModule): void {
    this.modules[this.modules.findIndex(m => m.id === module.id)].isDeleted = false;
  }

  public getControl(module: FormModule): string {
    return `module-${module.id}`;
  }
}
