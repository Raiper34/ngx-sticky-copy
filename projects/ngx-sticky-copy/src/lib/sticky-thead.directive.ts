import {Directive, Inject, Input, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
import {StickyDirective} from './sticky.directive';
import {DOCUMENT} from '@angular/common';

const TH_SELECTOR = 'tr th';

@Directive({
  selector: '[scStickyThead]'
})
export class StickyTheadDirective extends StickyDirective {

  @Input('scStickyThead') stickyOffset: number;

  constructor(protected readonly container: ViewContainerRef,
              protected readonly template: TemplateRef<HTMLElement>,
              @Inject(DOCUMENT) protected readonly document: any,
              protected readonly renderer: Renderer2) {
    super(container, template, document, renderer);
  }

  protected initializeStickyStyles(): void {
    this.stickyStyle.display = 'block';
    this.stickyStyle.overflow = 'hidden';
    super.initializeStickyStyles();
  }

  protected recalculateStickyStyles(): void {
    super.recalculateStickyStyles();
    const fixedThs = this.fixed.rootNodes[0].querySelectorAll(TH_SELECTOR);
    const stickyThs = this.sticky.rootNodes[0].querySelectorAll(TH_SELECTOR);
    for (let i = 0; i < fixedThs.length; i++) {
      stickyThs[i].style.width = `${fixedThs[i].getBoundingClientRect().width}px`;
      stickyThs[i].style.height = `${fixedThs[i].getBoundingClientRect().height}px`;
      stickyThs[i].style.display = 'inline-block';
    }
  }

}
