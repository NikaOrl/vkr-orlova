import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// header
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarksModule } from './marks/marks.module';
import { CoreModule } from './core/core.module';
import { GroupsModule } from './groups/groups.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MarksModule,
    GroupsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
