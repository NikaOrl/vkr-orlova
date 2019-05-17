import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { MarksEditComponent } from './components/marks-edit/marks-edit.component';
import { MarksTableComponent } from './components/marks-table/marks-table.component';

const routes: Routes = [
  {
    path: '',
    component: MarksPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'edit/:disciplineId',
        component: MarksEditComponent,
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
