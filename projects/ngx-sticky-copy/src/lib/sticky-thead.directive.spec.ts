import {StickyTheadDirective} from './sticky-thead.directive';
import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

const TEST_PAGE_HEIGHT = 10000;

@Component({
  selector: 'lib-test-component',
  template: `
    <table>
      <thead *xaStickyThead class="stickyThead">
      <tr>
        <th>Column1</th>
        <th>Column2</th>
        <th>Column3</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Row1 Column1</td>
        <td>Row1 Column2</td>
        <td>Row1 Column3</td>
      </tr>
      <tr>
        <td>Row2 Column1</td>
        <td>Row2 Column2</td>
        <td>Row2 Column3</td>
      </tr>
      </tbody>
    </table>
    <div [style.height.px]="pageHeight">Content</div>
  `
})
class TestComponent {
  pageHeight = TEST_PAGE_HEIGHT;
}

function getElementWidth(element: DebugElement): number {
  return element.nativeElement.getBoundingClientRect().width;
}

function getThs(fixture: ComponentFixture<TestComponent>, isStickyCopy: boolean = false): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(`.stickyThead:nth-child(${isStickyCopy ? 2 : 1}) tr th`));
}

describe('StickyTheadDirective', () => {

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StickyTheadDirective, TestComponent],
    });

    TestBed.compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new StickyTheadDirective(null, null, null, null);
    expect(directive).toBeTruthy();
  });

  it('headers cell should have same width', async (done) => {
    setTimeout(() => {
      const fixedThs = getThs(fixture);
      const stickyThs = getThs(fixture, true);
      expect(fixedThs.length).withContext(`Number of columns should be same`).toBe(stickyThs.length);
      for (let i = 0; i < fixedThs.length; i++) {
        expect(getElementWidth(fixedThs[i]))
          .withContext(`Fixed table head cell width and sticky table head cell width on index ${i} should be same`)
          .toBe(getElementWidth(stickyThs[i]));
      }
      done();
    }, 0);
  });
});
