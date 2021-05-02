import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
})
export class MarksEditComponent implements OnInit {
  public selectedGroupId: string;
  public selectedDisciplineId: string;

  private marksSaved: boolean = true;
  private modulesSaved: boolean = true;
  private attendanceSaved: boolean = true;

  constructor(private route: ActivatedRoute, private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = this.route.snapshot.paramMap.get('disciplineId');
    this.selectedGroupId = this.route.snapshot.paramMap.get('groupId');
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.marksSaved && this.modulesSaved && this.attendanceSaved) {
      return true;
    }
    return this.dialogService.confirm(`At least one of tabs isn't saved. Discard changes?`);
  }

  public setMarksSaved(saved: boolean): void {
    this.marksSaved = saved;
  }

  public setModulesSaved(saved: boolean): void {
    this.modulesSaved = saved;
  }

  public setAttendanceSaved(saved: boolean): void {
    this.attendanceSaved = saved;
  }
}
