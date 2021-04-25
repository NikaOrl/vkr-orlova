import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { GroupPageComponent } from './components/group-page/group-page.component';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsEditComponent } from './components/groups-edit/groups-edit.component';
import { SharedModule } from '../shared/shared.module';
import { TranslocoRootModule } from '../transloco/transloco-root.module';

@NgModule({
  declarations: [GroupPageComponent, GroupTableComponent, GroupsEditComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    TranslocoRootModule,
    GroupsRoutingModule,
  ],
  exports: [GroupPageComponent],
})
export class GroupsModule {}
