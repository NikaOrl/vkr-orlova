import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisciplinesPageComponent } from './components/disciplines-page/disciplines-page.component';

const routes: Routes = [
  {
    path: '',
    component: DisciplinesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisciplinesRoutingModule {}
