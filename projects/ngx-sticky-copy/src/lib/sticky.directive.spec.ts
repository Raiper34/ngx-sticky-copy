import {Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {StickyDirective} from './sticky.directive';

const TEST_PAGE_SIZE = 10000;
const TEST_CLASS = 'my-sticky';
const TEST_DELAY_MS = 0;

@Component({
  selector: 'lib-test-component',
  template: `
    <div class="sticky" *scSticky="{stickyClass: class}">Sticky container</div>
    <div [style.height.px]="pageSize" [style.width.px]="pageSize">Content</div>
  `
})
class TestComponent {
  pageSize = TEST_PAGE_SIZE;
  class = TEST_CLASS;
}

function scrollTo(
  fixture: ComponentFixture<TestComponent>,
  yPosition: number,
  xPosition: number = 0,
): void {
  window.scrollTo(xPosition, yPosition);
  document.dispatchEvent(new Event('scroll'));
  fixture.detectChanges();
}

function checkVisibility(
  fixed: DebugElement, sticky: DebugElement, done: any,
  expectedFixedVisibility: string = 'hidden', expectedStickyDisplay: string = ''
): void {
  setTimeout(() => {
    const fixedVisibility = fixed.nativeElement.style.visibility;
    expect(fixedVisibility).toBe(expectedFixedVisibility);

    const stickyDisplay = sticky.nativeElement.style.display;
    expect(stickyDisplay).toBe(expectedStickyDisplay);
    done();
  }, TEST_DELAY_MS);
}

function checkProperty(fixed: DebugElement, sticky: DebugElement, prop: string): void {
  const fixedProp = fixed.nativeElement.getBoundingClientRect()[prop];
  const stickyProp = Number(sticky.nativeElement.style[prop].replace('px', ''));
  expect(stickyProp).toBe(fixedProp);
}

describe('StickyDirective', () => {

  let fixture: ComponentFixture<TestComponent>;
  let fixed: DebugElement;
  let sticky: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StickyDirective, TestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    [fixed, sticky] = fixture.debugElement.queryAll(By.css('.sticky'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new StickyDirective(null, null, null, null);
    expect(directive).toBeTruthy();
  });

  it('should have 2 copies of element', () => {
    const divElements = fixture.debugElement.queryAll(By.css('.sticky'));
    expect(divElements.length).toBe(2);
  });


  it('should have same size and position', (done) => {
    scrollTo(fixture, TEST_PAGE_SIZE / 2);
    setTimeout(() => {
      const stickyTopPosition = Number(sticky.nativeElement.style.top.replace('px', ''));
      expect(stickyTopPosition).toBe(0);
      checkProperty(fixed, sticky, 'left');
      checkProperty(fixed, sticky, 'width');
      checkProperty(fixed, sticky, 'height');
      done();
    }, TEST_DELAY_MS);
  });

  it('should be fixed visible when at the top of page', (done) => {
    scrollTo(fixture, 0);
    checkVisibility(fixed, sticky, done, 'visible', 'none');
  });

  it('should be sticky visible when scrolled down', (done) => {
    scrollTo(fixture, TEST_PAGE_SIZE / 2);
    checkVisibility(fixed, sticky, done);
  });

  it('should be fixed visible when scrolled down and then back up', (done) => {
    scrollTo(fixture, TEST_PAGE_SIZE / 2);
    scrollTo(fixture, 0);
    checkVisibility(fixed, sticky, done, 'visible', 'none');
  });

  it('should be sticky visible when scrolled left', (done) => {
    scrollTo(fixture, 0, TEST_PAGE_SIZE / 2);
    checkVisibility(fixed, sticky, done);
  });

  it('should be fixed visible when scrolled left and then back right', (done) => {
    scrollTo(fixture, 0, TEST_PAGE_SIZE / 2);
    scrollTo(fixture, 0, 0);
    checkVisibility(fixed, sticky, done, 'visible', 'none');
  });

  it('should be sticky visible when scrolled left and down', (done) => {
    scrollTo(fixture, TEST_PAGE_SIZE / 2, TEST_PAGE_SIZE / 2);
    checkVisibility(fixed, sticky, done);
  });

  it('should sticky have class', () => {
    const stickyElement = fixture.debugElement.query(By.css(`.${TEST_CLASS}`));
    expect(stickyElement).toBeTruthy();
  });

});
