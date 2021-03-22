import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { MarksRoutingModule } from './marks-routing.module';
import { MarksEditComponent } from './components/marks-edit/marks-edit.component';
import { MarksDialogComponent } from './components/marks-dialog/marks-dialog.component';

@NgModule({
  declarations: [
    MarksTableComponent,
    MarksPageComponent,
    MarksEditComponent,
    MarksDialogComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    HttpClientModule,
    CdkTableModule,
    FormsModule,
    MarksRoutingModule,
  ],
  entryComponents: [MarksDialogComponent],
  exports: [MarksPageComponent],
})
export class MarksModule {}
