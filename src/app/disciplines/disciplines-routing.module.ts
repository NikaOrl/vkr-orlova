import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { DisciplinesPageComponent } from './components/disciplines-page/disciplines-page.component';

const routes: Routes = [
  {
    path: '',
    component: DisciplinesPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisciplinesRoutingModule {}
