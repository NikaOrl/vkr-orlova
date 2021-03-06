import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DisciplinesPageComponent } from './components/disciplines-page/disciplines-page.component';
import { DisciplinesRoutingModule } from './disciplines-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DisciplineStudentsDialogComponent } from './components/discipline-students-dialog/discipline-students-dialog.component';
import { DisciplineDialogComponent } from './components/discipline-dialog/discipline-dialog.component';
import { TranslocoRootModule } from '../transloco/transloco-root.module';
import { DisciplineDeleteDialogComponent } from './components/discipline-delete-dialog/discipline-delete-dialog.component';
import { DisciplineSemesterDialogComponent } from './components/discipline-semester-dialog/discipline-semester-dialog.component';

@NgModule({
  declarations: [
    DisciplinesPageComponent,
    DisciplineStudentsDialogComponent,
    DisciplineDialogComponent,
    DisciplineDeleteDialogComponent,
    DisciplineSemesterDialogComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoRootModule,
    DisciplinesRoutingModule,
  ],
})
export class DisciplinesModule {}
