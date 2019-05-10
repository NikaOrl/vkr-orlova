import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';

import { GroupPageComponent } from './components/group-page/group-page.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { GroupsRoutingModule } from './groups-routing.module';

@NgModule({
  declarations: [GroupPageComponent, GroupTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSortModule,
    HttpClientModule,
    GroupsRoutingModule,
  ],
  exports: [GroupPageComponent],
})
export class GroupsModule {}
