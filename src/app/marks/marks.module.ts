import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
} from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { MarksRoutingModule } from './marks-routing.module';
import { MarksEditComponent } from './components/marks-edit/marks-edit.component';

@NgModule({
  declarations: [MarksTableComponent, MarksPageComponent, MarksEditComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    HttpClientModule,
    CdkTableModule,
    FormsModule,
    MarksRoutingModule,
  ],
  exports: [MarksPageComponent],
})
export class MarksModule {}
