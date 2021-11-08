import { NgModule } from '@angular/core';
import { StickyDirective } from './sticky.directive';
import { StickyTheadDirective } from './sticky-thead.directive';



@NgModule({
  declarations: [StickyDirective, StickyTheadDirective],
  imports: [
  ],
  exports: [StickyDirective, StickyTheadDirective]
})
export class NgxStickyCopyModule { }
