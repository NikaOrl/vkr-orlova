import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPageComponent } from './components/group-page/group-page.component';

const routes: Routes = [
  {
    path: 'groups',
    component: GroupPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
