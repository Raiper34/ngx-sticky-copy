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
import {StickyConfig} from './sticky-config';

const DEFAULT_OFFSET = 0;
const DEFAULT_STICKY_CLASS = 'sticky';

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

  protected get verticalOffset(): number {
    return this.config?.verticalOffset || DEFAULT_OFFSET;
  }

  protected get horizontalOffset(): number {
    return this.config?.horizontalOffset || DEFAULT_OFFSET;
  }

  private get stickyClass(): string {
    return this.config?.stickyClass || DEFAULT_STICKY_CLASS;
  }

  @Input('scSticky') config: StickyConfig;

  protected fixed: EmbeddedViewRef<HTMLElement>;
  protected sticky: EmbeddedViewRef<HTMLElement>;
  private onScrollEventListener: () => void;

  constructor(protected readonly container: ViewContainerRef,
              protected readonly template: TemplateRef<HTMLElement>,
              @Inject(DOCUMENT) protected readonly document: any,
              protected readonly renderer: Renderer2) {
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
    !this.isSizeAndPositionValid() && this.recalculateStickyStyles();
  }

  private isSizeAndPositionValid(): boolean {
    return this.fixedClientRect.width === this.stickyClientRect.width &&
      this.fixedClientRect.height === this.stickyClientRect.height &&
      (this.fixedClientRect.left === this.stickyClientRect.left || this.stickyClientRect.left === this.horizontalOffset)  &&
      (this.fixedClientRect.top === this.stickyClientRect.top || this.stickyClientRect.top === this.verticalOffset);
  }

  private recreateElements(): void {
    this.fixed = this.container.createEmbeddedView(this.template);
    this.sticky = this.container.createEmbeddedView(this.template);
    this.sticky.rootNodes[0].classList.add(this.stickyClass);
  }

  protected initializeStickyStyles(): void {
    this.fixedStyle.visibility = 'visible';
    this.stickyStyle.position = 'fixed';
    this.stickyStyle.display = 'none';
    setTimeout(() => this.recalculateStickyStyles());
  }

  private shouldShowSticky(): boolean {
    return this.fixedClientRect.top < this.verticalOffset || this.fixedClientRect.left < this.horizontalOffset;
  }

  private shouldHideSticky(): boolean {
    return this.fixedClientRect.top >= this.verticalOffset || this.fixedClientRect.left >= this.horizontalOffset;
  }

  private showSticky(): void {
    this.stickyStyle.display = this.fixedStyle.display;
    this.fixedStyle.visibility = 'hidden';
  }

  private hideSticky(): void {
    this.stickyStyle.display = 'none';
    this.fixedStyle.visibility = 'visible';
  }

  private onScroll(): void {
    if (this.shouldShowSticky()) {
      this.showSticky();
    } else if (this.shouldHideSticky()) {
      this.hideSticky();
    }
  }

  protected recalculateStickyStyles(): void {
    this.stickyStyle.width = `${this.fixedClientRect.width}px`;
    this.stickyStyle.height = `${this.fixedClientRect.height}px`;
    this.stickyStyle.left = `${Math.max(this.horizontalOffset, this.fixedClientRect.left)}px`;
    this.stickyStyle.top = `${Math.max(this.verticalOffset, this.fixedClientRect.top)}px`;
  }

}
