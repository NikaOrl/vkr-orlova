import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { GroupPageComponent } from './components/group-page/group-page.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GroupPageComponent, GroupTableComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    HttpClientModule,
    FormsModule,
    GroupsRoutingModule,
  ],
  exports: [GroupPageComponent],
})
export class GroupsModule {}
