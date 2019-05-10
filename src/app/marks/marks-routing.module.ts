import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksPageComponent } from './components/marks-page/marks-page.component';

const routes: Routes = [
  {
    path: 'marks',
    component: MarksPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MarksRoutingModule {}
