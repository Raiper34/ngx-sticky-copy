import {Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {StickyDirective} from './sticky.directive';

const TEST_PAGE_HEIGHT = 10000;
const TEST_DELAY_MS = 0;

@Component({
  selector: 'lib-test-component',
  template: `
    <div class="sticky" *scSticky>Sticky container</div>
    <div [style.height.px]="pageHeight">Content</div>
  `
})
class TestComponent {
  pageHeight = TEST_PAGE_HEIGHT;
}

function scrollTo(
  fixture: ComponentFixture<TestComponent>,
  yPosition: number,
): void {
  window.scrollTo(0, yPosition);
  document.dispatchEvent(new Event('scroll'));
  fixture.detectChanges();
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
    scrollTo(fixture, TEST_PAGE_HEIGHT / 2);
    setTimeout(() => {
      const fixedLeftPosition = fixed.nativeElement.getBoundingClientRect().left;
      const stickyLeftPosition = Number(sticky.nativeElement.style.left.replace('px', ''));
      expect(stickyLeftPosition).toBe(fixedLeftPosition);

      const fixedWidth = fixed.nativeElement.getBoundingClientRect().width;
      const stickyWidth = Number(sticky.nativeElement.style.width.replace('px', ''));
      expect(stickyWidth).toBe(fixedWidth);

      const fixedHeight = fixed.nativeElement.getBoundingClientRect().height;
      const stickyHeight = Number(sticky.nativeElement.style.height.replace('px', ''));
      expect(stickyHeight).toBe(fixedHeight);
      done();
    }, TEST_DELAY_MS);
  });

  it('should be fixed visible when at the top of page', (done) => {
    scrollTo(fixture, 0);
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('visible');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('none');
      done();
    }, TEST_DELAY_MS);
  });

  it('should be sticky visible when scrolled', (done) => {
    scrollTo(fixture, TEST_PAGE_HEIGHT / 2);
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('hidden');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('');
      done();
    }, TEST_DELAY_MS);
  });

  it('should be fixed visible when scrolled down and then back up', (done) => {
    scrollTo(fixture, TEST_PAGE_HEIGHT / 2);
    scrollTo(fixture, 0);
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('visible');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('none');
      done();
    }, TEST_DELAY_MS);
  });

});
