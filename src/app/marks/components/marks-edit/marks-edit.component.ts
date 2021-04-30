import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-marks-edit',
  templateUrl: './marks-edit.component.html',
  styleUrls: ['./marks-edit.component.scss'],
})
export class MarksEditComponent implements OnInit {
  public selectedGroupId: string;
  public selectedDisciplineId: string;

  private marksSaved: boolean = true;
  private modulesSaved: boolean = true;

  constructor(private route: ActivatedRoute, private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.selectedDisciplineId = this.route.snapshot.paramMap.get('disciplineId');
    this.selectedGroupId = this.route.snapshot.paramMap.get('groupId');
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.marksSaved && this.modulesSaved) {
      return true;
    } else if (!this.marksSaved && !this.modulesSaved) {
      return this.dialogService.confirm(`Marks and modules tabs both aren't saved. Discard changes?`);
    } else if (!this.marksSaved) {
      return this.dialogService.confirm(`Marks tab isn't saved. Discard changes?`);
    }
    return this.dialogService.confirm(`Modules tab isn't saved. Discard changes?`);
  }

  public setMarksSaved(saved: boolean): void {
    this.marksSaved = saved;
  }

  public setModulesSaved(saved: boolean): void {
    this.modulesSaved = saved;
  }
}
