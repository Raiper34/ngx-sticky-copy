import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgxStickyCopyModule} from 'ngx-sticky-copy';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxStickyCopyModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
