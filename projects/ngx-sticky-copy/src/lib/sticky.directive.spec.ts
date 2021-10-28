import {Component, DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {StickyDirective} from './sticky.directive';

const TEST_PAGE_HEIGHT = 10000;
const TEST_DELAY_MS = 1000;

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

describe('StickyDirective', () => {

  let componentFixture: ComponentFixture<TestComponent>;
  let fixed: DebugElement;
  let sticky: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StickyDirective, TestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    componentFixture = TestBed.createComponent(TestComponent);
    componentFixture.detectChanges();
    [fixed, sticky] = componentFixture.debugElement.queryAll(By.css('.sticky'));
    window.scrollTo(0, 0);
    componentFixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new StickyDirective(null, null, null, null);
    expect(directive).toBeTruthy();
  });

  it('should have 2 copies of element', () => {
    const divElements = componentFixture.debugElement.queryAll(By.css('.sticky'));
    expect(divElements.length).toBe(2);
  });


  it('should have same size and position', (done) => {
    window.scrollTo(0, TEST_PAGE_HEIGHT / 2);
    componentFixture.detectChanges();
    setTimeout(() => {
      const fixedLeftPosition = fixed.nativeElement.getBoundingClientRect().left;
      const stickyLeftPosition = sticky.nativeElement.getBoundingClientRect().left;
      expect(stickyLeftPosition).toBe(fixedLeftPosition);

      const fixedWidth = fixed.nativeElement.getBoundingClientRect().width;
      const stickyWidth = sticky.nativeElement.getBoundingClientRect().width;
      expect(stickyWidth).toBe(fixedWidth);

      const fixedHeight = fixed.nativeElement.getBoundingClientRect().height;
      const stickyHeight = sticky.nativeElement.getBoundingClientRect().height;
      expect(stickyHeight).toBe(fixedHeight);
      done();
    }, TEST_DELAY_MS);
  });

  it('should be only fixed visible when at the top of page', (done) => {
    window.scrollTo(0, 0);
    componentFixture.detectChanges();
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('none');
      done();
    }, TEST_DELAY_MS);
  });

  it('should be only sticky visible when scrolled', (done) => {
    window.scrollTo(0, TEST_PAGE_HEIGHT / 2);
    componentFixture.detectChanges();
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('hidden');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('');
      done();
    }, TEST_DELAY_MS);
  });

  it('should be only sticky visible when scrolled down and then back up', (done) => {
    window.scrollTo(0, TEST_PAGE_HEIGHT / 2);
    componentFixture.detectChanges();
    setTimeout(() => {
      window.scrollTo(0, 0);
      componentFixture.detectChanges();
    }, TEST_DELAY_MS / 2);
    setTimeout(() => {
      const fixedVisibility = fixed.nativeElement.style.visibility;
      expect(fixedVisibility).toBe('visible');

      const stickyDisplay = sticky.nativeElement.style.display;
      expect(stickyDisplay).toBe('none');
      done();
    }, TEST_DELAY_MS);
  });

});
