import {
  TestThatFixture,
  testThatFixture,
} from '../../../test-that-ng/FixtureExtensions';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { TestSuite, check, init, test } from 'test-that';
import { By } from '@angular/platform-browser';

let fixture: TestThatFixture<SidebarComponent>;

new TestSuite(
  'SidebarComponent',

  init(async () => {
    fixture = await testThatFixture(SidebarComponent, {
      imports: [RouterTestingModule]
    });
    await fixture.preview()
  }),

  test.that('navigates to documentation', () => {
    check(
      fixture.debugElement.query(By.css('.documentation')).nativeElement.href
    ).stringIncludes('/documentation');
  })
);
