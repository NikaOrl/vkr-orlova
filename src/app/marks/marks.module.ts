import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';

import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { MarksRoutingModule } from './marks-routing.module';

@NgModule({
  declarations: [MarksTableComponent, MarksPageComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    HttpClientModule,
    CdkTableModule,
    MarksRoutingModule,
  ],
  exports: [MarksPageComponent],
})
export class MarksModule {}
