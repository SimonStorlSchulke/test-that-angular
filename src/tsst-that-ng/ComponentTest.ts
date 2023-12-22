import { routes } from './../app/app.routes';
import { HttpClient } from '@angular/common/http';
import {
  ApplicationRef,
  Component,
  ComponentRef,
  EnvironmentInjector,
  EnvironmentProviders,
  Provider,
  Type,
  createComponent,
} from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '',
  standalone: true,
})
class TestRootComponent {}

export function componentTestBuilder() {
  return new ComponentTestBuilder();
}

class ComponentTestBuilder {
  private providers: (Provider | EnvironmentProviders)[] = [];

  addProviders(provider: Provider | EnvironmentProviders[]) {
    this.providers.push(provider);
    return this;
  }

  provide(provide: any) {
    this.providers.push(provide);
    return this;
  }

  provideAsValue(provide: any, value: any) {
    this.providers.push({
      provide: provide,
      useValue: value,
    });
    return this;
  }

  provideHttpClient(value?: any) {
    this.providers.push({
      provide: HttpClient,
      useValue: value ?? {},
    });
    return this;
  }

  async build<C>(componentType: Type<C>): Promise<ComponentTest<C>> {
    const host = document.createElement('div');

    const applicationRef = await bootstrapApplication(TestRootComponent, {
      
      providers: [provideRouter(routes), ...this.providers], // provideRouter() might be needed at some point
    });

    const environmentInjector = applicationRef.injector;
    const comp = createComponent(componentType, {
      hostElement: host,
      environmentInjector: environmentInjector,
    });

    const componentTest = new ComponentTest<C>(
      applicationRef,
      environmentInjector
    );
    await componentTest.init(host, comp);

    return componentTest;
  }
}

export class ComponentTest<T> {
  host!: HTMLDivElement;
  componentRef!: ComponentRef<T>;

  constructor(
    private applicationRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  async init(host: HTMLDivElement, ref: ComponentRef<T>) {
    this.host = host;
    this.componentRef = ref;
  }

  /** alias for host.querySelector. Preferably give your tested html elements a
   * testId attribute and use queryTestId instead to harden tests against style / html changes. */
  query(cssSelector: string): HTMLElement | null {
    return this.host.querySelector(cssSelector);
  }

  /** alias for host.querySelectorAll */
  queryAll(cssSelector: string): NodeListOf<Element> {
    return this.host.querySelectorAll(cssSelector);
  }

  /** returns the first element, which has an html attribute with the given testId.
   * This may be prefered to css selectors, since it decouples tests and lets developers know that the
   * testId attribute is needed for unittests
   * @example //template html
   * <h2 testId="title">Nice Title</h2>
   * //testcode
   * check(componentTest.queryTestId("title")).equals("Nice Title")
   */
  queryTestId(testId: string): HTMLElement | null {
    return this.host.querySelector(`[testId = '${testId}']`);
  }

  /** returns a NodeList of elements with the given testId */
  queryAllTestId(testId: string): NodeListOf<Element> {
    return this.host.querySelectorAll(`[testId = '${testId}']`);
  }

  public get instance() {
    return this.componentRef.instance;
  }

  detectChanges() {
    this.componentRef.changeDetectorRef.detectChanges();
  }

  /** alias for instance.ngOnInit() */
  /*   onInit() {
    if (this.instance.ngOnInit) this.instance.ngOnInit(); //TODO if maybe useless
  } */

  /** If forSeconds is set to anything but 0, this returns  */
  async renderComponentPreview(
    forSeconds: number = 0,
    background: string = ''
  ) {
    const previewWindow = document.querySelector<HTMLElement>('.test-preview')!;
    previewWindow.innerHTML = '';
    previewWindow.append(this.host);

    if (background != '') previewWindow.style.backgroundColor = background;

    // TODO make optional via run argument
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, forSeconds * 1000)
    );
  }
}

export async function renderFixturePreview(
  fixture: ComponentFixture<any>,
  forSeconds: number = 0,
  background: string = ''
) {
  const previewWindow = document.querySelector<HTMLElement>('.test-preview')!;
  previewWindow.innerHTML = '';
  previewWindow.append(fixture.nativeElement);

  if (background != '') previewWindow.style.backgroundColor = background;

  // TODO make optional via run argument
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, forSeconds * 1000)
  );
}
