import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPageComponent } from './components/group-page/group-page.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { GroupTableComponent } from './components/group-table/group-table.component';
import { GroupsEditComponent } from './components/groups-edit/groups-edit.component';
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: GroupPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'edit/:groupId',
        component: GroupsEditComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: GroupTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
