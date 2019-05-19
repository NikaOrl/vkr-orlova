import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { MarksEditComponent } from './components/marks-edit/marks-edit.component';
import { MarksTableComponent } from './components/marks-table/marks-table.component';
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: MarksPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'edit/:disciplineId',
        component: MarksEditComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: MarksTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarksRoutingModule {}
