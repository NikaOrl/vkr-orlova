import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { HeaderComponent } from './components/header/header.component';
import { TranslocoRootModule } from '../transloco/transloco-root.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule, TranslocoRootModule, RouterModule],
  exports: [HeaderComponent],
})
export class SharedModule {}
