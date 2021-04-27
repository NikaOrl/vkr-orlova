import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDiscipline } from '../../models/discipline.model';
import { DisciplinesApiService } from '../../services/disciplines-api.service';

@Component({
  selector: 'app-discipline-delete-dialog',
  templateUrl: './discipline-delete-dialog.component.html',
  styleUrls: ['./discipline-delete-dialog.component.scss'],
})
export class DisciplineDeleteDialogComponent implements OnInit {
  public discipline: IDiscipline;

  constructor(
    public dialogRef: MatDialogRef<DisciplineDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { discipline: IDiscipline },
    private api: DisciplinesApiService
  ) {}

  public ngOnInit(): void {
    this.discipline = this.data.discipline;
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public onOkClick(): void {
    this.api.deleteDiscipline(this.discipline.id).subscribe(res => {
      this.dialogRef.close();
    });
  }

  public get disciplineName(): string {
    return this.discipline && this.discipline.disciplineValue ? this.discipline.disciplineValue : '';
  }
}
