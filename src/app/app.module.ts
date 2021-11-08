import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgxStickyCopyModule} from 'ngx-sticky-copy';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    NgxStickyCopyModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
