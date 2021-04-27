import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DisciplinesPageComponent } from './components/disciplines-page/disciplines-page.component';
import { DisciplinesRoutingModule } from './disciplines-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DisciplineDialogComponent } from './components/discipline-dialog/discipline-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DisciplinesPageComponent, DisciplineDialogComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    SharedModule,
    DisciplinesRoutingModule,
  ],
})
export class DisciplinesModule {}
