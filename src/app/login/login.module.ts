import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    LoginRoutingModule,
  ],
  exports: [LoginPageComponent],
})
export class LoginModule {}
