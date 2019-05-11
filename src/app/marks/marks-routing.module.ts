import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksPageComponent } from './components/marks-page/marks-page.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MarksPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarksRoutingModule {}
