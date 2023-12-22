import { TestSuite, check, test } from 'test-that';

new TestSuite("App component", 

  test.that("app starts", ()=> {
    check(1).equals(1);
  })
)
