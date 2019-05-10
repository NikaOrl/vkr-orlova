import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathNotFoundComponent } from './components/path-not-found/path-not-found.component';

@NgModule({
  declarations: [PathNotFoundComponent],
  imports: [CommonModule],
  exports: [PathNotFoundComponent],
})
export class CoreModule {}
