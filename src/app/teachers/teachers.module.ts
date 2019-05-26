import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSortModule,
  MatCheckboxModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeachersPageComponent } from './components/teachers-page/teachers-page.component';
import { TeachersEditComponent } from './components/teachers-edit/teachers-edit.component';
import { TeachersTableComponent } from './components/teachers-table/teachers-table.component';

@NgModule({
  declarations: [
    TeachersPageComponent,
    TeachersEditComponent,
    TeachersTableComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    HttpClientModule,
    MatCheckboxModule,
    FormsModule,

    TeachersRoutingModule,
  ],
})
export class TeachersModule {}
