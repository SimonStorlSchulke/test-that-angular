
import { ObservableTestComponent } from './observable-test.component';
import {
  TestThatFixture,
  testThatFixture,
} from '../../../test-that-ng/FixtureExtensions';
import { Mock, TestSuite, check, init, mock, test } from 'test-that';
import { of } from 'rxjs';

let fixture: TestThatFixture<ObservableTestComponent>;

new TestSuite(
  'Observables',

  init(async () => {
    fixture = await testThatFixture(ObservableTestComponent);
  }),

  test.that('Users get fetched and displayed', async () => {

    (fixture.componentInstance.http.get as Mock) = mock.returnWithArgs([
      {args: ["https://reqres.in/api/users"], returnVal: of({
        data: [
          {
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
          },
          {
            id: 2,
            email: 'janet.weaver@reqres.in',
            first_name: 'Janet',
            last_name: 'Weaver',
            avatar: 'https://reqres.in/img/faces/2-image.jpg',
          },
        ],
      })}
    ], null);

    fixture.componentInstance.ngOnInit();

    fixture.detectChanges();

    fixture.preview();

    const george = fixture.dom.queryTestId<HTMLElement>('user-name');
    const totalUsers = fixture.dom.queryTestId<HTMLElement>('total-users');

    check(fixture.componentInstance.http.get).calledWithArgs([
      'https://reqres.in/api/users',
    ]);

    check(george?.innerText).stringIncludes('George');
    check(totalUsers?.innerText).equals('Total users: 2');
  })
);
