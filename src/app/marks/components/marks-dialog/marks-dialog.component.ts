import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IDialogData } from '../../models/dialog-data.model';

@Component({
  selector: 'app-marks-dialog',
  templateUrl: './marks-dialog.component.html',
  styleUrls: ['./marks-dialog.component.scss'],
})
export class MarksDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MarksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
