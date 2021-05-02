import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { MarksRoutingModule } from './marks-routing.module';
import { MarksEditComponent } from './components/marks-edit/marks-edit.component';
import { MarksDialogComponent } from './components/marks-dialog/marks-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TranslocoRootModule } from '../transloco/transloco-root.module';
import { MarksEditTableComponent } from './components/marks-edit-table/marks-edit-table.component';
import { MarksEditJobsComponent } from './components/marks-edit-jobs/marks-edit-jobs.component';
import { MarksEditAttendanceComponent } from './components/marks-edit-attendance/marks-edit-attendance.component';

@NgModule({
  declarations: [
    MarksTableComponent,
    MarksPageComponent,
    MarksEditComponent,
    MarksDialogComponent,
    MarksEditTableComponent,
    MarksEditJobsComponent,
    MarksEditAttendanceComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    DragDropModule,
    HttpClientModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslocoRootModule,
    MarksRoutingModule,
  ],
  exports: [MarksPageComponent],
})
export class MarksModule {}
