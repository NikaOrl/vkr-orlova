import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MarksTableComponent, MarksPageComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSortModule,
    HttpClientModule,
  ],
  exports: [MarksPageComponent],
})
export class MarksModule {}
