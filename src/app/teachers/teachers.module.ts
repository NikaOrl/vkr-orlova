import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeachersPageComponent } from './components/teachers-page/teachers-page.component';
import { TeachersEditComponent } from './components/teachers-edit/teachers-edit.component';
import { TeachersTableComponent } from './components/teachers-table/teachers-table.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TeachersPageComponent, TeachersEditComponent, TeachersTableComponent],
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
    SharedModule,
    TeachersRoutingModule,
  ],
})
export class TeachersModule {}
