import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ReplacePipe } from './utils/ReplacePipe';
import { NotificationModule } from './notification.module';

@NgModule({
  declarations: [
    AppComponent,
    ReplacePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
