import {
  Directive, DoCheck,
  EmbeddedViewRef, Inject,
  Input,
  OnDestroy,
  OnInit, Renderer2,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

const DEFAULT_OFFSET = 0;
const HIDDEN_DISPLAY = 'none';
const WATCH_PROPS = ['width', 'height', 'left'];

@Directive({
  selector: '[scSticky]'
})
export class StickyDirective implements OnInit, OnDestroy, DoCheck {

  protected get stickyStyle(): CSSStyleDeclaration {
    return this.sticky.rootNodes[0].style;
  }

  protected get fixedStyle(): CSSStyleDeclaration {
    return this.fixed.rootNodes[0].style;
  }

  protected get fixedClientRect(): ClientRect {
    return this.fixed.rootNodes[0].getBoundingClientRect();
  }

  protected get stickyClientRect(): ClientRect {
    return this.sticky.rootNodes[0].getBoundingClientRect();
  }

  protected get offset(): number {
    return this.stickyOffset || DEFAULT_OFFSET;
  }

  @Input('scSticky') stickyOffset: number;

  protected fixed: EmbeddedViewRef<HTMLElement>;
  protected sticky: EmbeddedViewRef<HTMLElement>;
  onScrollEventListener: () => void;

  constructor(private readonly container: ViewContainerRef,
              private readonly template: TemplateRef<HTMLElement>,
              @Inject(DOCUMENT) private readonly document: any,
              private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.recreateElements();
    this.initializeStickyStyles();
    this.onScrollEventListener = this.renderer.listen(this.document, 'scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    this.onScrollEventListener();
  }

  ngDoCheck(): void {
    if (!this.isSizeAndWidthSame()) {
      this.recalculateStickyStyles();
    }
  }

  protected isSizeAndWidthSame(): boolean {
    return WATCH_PROPS.every(prop => this.fixedClientRect[prop] === this.stickyClientRect[prop]);
  }

  protected recreateElements(): void {
    this.fixed = this.container.createEmbeddedView(this.template);
    this.sticky = this.container.createEmbeddedView(this.template);
  }

  protected initializeStickyStyles(): void {
    this.stickyStyle.position = 'fixed';
    this.stickyStyle.display = HIDDEN_DISPLAY;
    setTimeout(() => this.recalculateStickyStyles());
  }

  protected shouldShowSticky() {
    return this.fixedClientRect.top < this.offset && this.stickyStyle.display === HIDDEN_DISPLAY;
  }

  protected shouldHideSticky() {
    return this.fixedClientRect.top >= this.offset && this.stickyStyle.display !== HIDDEN_DISPLAY;
  }

  protected showSticky(): void {
    this.stickyStyle.display = this.fixedStyle.display;
    this.fixedStyle.visibility = 'hidden';
  }

  protected hideSticky(): void {
    this.stickyStyle.display = HIDDEN_DISPLAY;
    this.fixedStyle.visibility = 'visible';
  }

  protected onScroll(): void {
    if (this.shouldShowSticky()) {
      this.showSticky();
    } else if (this.shouldHideSticky()) {
      this.hideSticky();
    }
  }

  protected recalculateStickyStyles(): void {
    WATCH_PROPS.forEach(prop => this.stickyStyle[prop] = `${this.fixedClientRect[prop]}px`);
    this.stickyStyle.top = `${this.offset}px`;
  }

}
