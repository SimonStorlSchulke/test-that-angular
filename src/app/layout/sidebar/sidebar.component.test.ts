import { TestThatFixture, createTestFixture } from './../../../tsst-that-ng/FixtureExtensions';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { TestSuite, check, init, test, xtest } from 'test-that';
import { ActivatedRoute, Routes, UrlSegment } from '@angular/router';
import { of } from 'rxjs';

import { TestBed} from '@angular/core/testing';
import { By } from '@angular/platform-browser';


let fixture: TestThatFixture<SidebarComponent>;

new TestSuite(
  'SidebarComponent',

  //componentTestBuilder<SidebarComponent>(fixture).build(),

  init(async () => {
    await TestBed.configureTestingModule({
        imports: [
            SidebarComponent,
            RouterTestingModule.withRoutes([
              { path: 'home', component: {}},
              { path: 'documentation', component: {}},
            ] as Routes),
          ],
    });

    fixture = createTestFixture(SidebarComponent);

    await fixture.preview();

    fixture.detectChanges();

    const route = new ActivatedRoute();
    route.url = of([new UrlSegment('/', {})]);
  }),

  xtest.that('header renders', async () => {
    check(fixture.nativeElement.innerHTML).stringIncludes('test.that()');
  }),

  xtest.that('navigates to documentation', () => {
    check((fixture.debugElement.query(By.css(".documentation")).nativeElement.href)).stringIncludes("/documentation")
  })
);
