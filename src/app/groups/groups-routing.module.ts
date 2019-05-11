import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPageComponent } from './components/group-page/group-page.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: GroupPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
