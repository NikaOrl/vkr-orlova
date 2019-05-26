import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';
import { TeachersEditComponent } from './components/teachers-edit/teachers-edit.component';
import { TeachersPageComponent } from './components/teachers-page/teachers-page.component';
import { TeachersTableComponent } from './components/teachers-table/teachers-table.component';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: TeachersPageComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'edit',
        component: TeachersEditComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: TeachersTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachersRoutingModule {}
