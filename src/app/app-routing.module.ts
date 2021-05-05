import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PathNotFoundComponent } from './core/components/path-not-found/path-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: 'groups',
    canLoad: [AuthGuard],
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule),
  },
  {
    path: 'marks',
    loadChildren: () => import('./marks/marks.module').then(m => m.MarksModule),
  },
  {
    path: 'teachers',
    canLoad: [AuthGuard, AdminGuard],
    loadChildren: () => import('./teachers/teachers.module').then(m => m.TeachersModule),
  },
  {
    path: 'disciplines',
    loadChildren: () => import('./disciplines/disciplines.module').then(m => m.DisciplinesModule),
  },
  {
    path: '',
    redirectTo: '/disciplines',
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
