import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PathNotFoundComponent } from './core/components/path-not-found/path-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: 'groups',
    canLoad: [AuthGuard],
    loadChildren: './groups/groups.module#GroupsModule',
  },
  {
    path: 'marks',
    canLoad: [AuthGuard],
    loadChildren: './marks/marks.module#MarksModule',
  },
  {
    path: 'teachers',
    canLoad: [AuthGuard, AdminGuard],
    loadChildren: './teachers/teachers.module#TeachersModule',
  },
  {
    path: '',
    redirectTo: '/marks',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PathNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
