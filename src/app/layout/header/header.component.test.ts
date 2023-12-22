import { TestSuite, check, init, test, xtest } from 'test-that';
import { HeaderComponent } from './header.component';
import { ComponentTest, componentTestBuilder } from '../../../tsst-that-ng/ComponentTest';

let componentTest: ComponentTest<HeaderComponent>;

new TestSuite("Header",

  init(async () => {
    componentTest = await componentTestBuilder(

    )
    .build(HeaderComponent);

    componentTest.detectChanges();
  }),

  test.that("header renders", async () => {

    await componentTest.renderComponentPreview(1);
    
    check(componentTest.host.innerText).stringIncludes("12");
    componentTest.instance.testval = 22;
    
    componentTest.detectChanges();
    
    await componentTest.renderComponentPreview(1);
    check(componentTest.host.innerText).stringIncludes("22");

  })

);