import { ComponentRef, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';

export class TestThatFixture<T> extends ComponentFixture<T> {
  //override ['constructor']: new (...args: ConstructorParameters<typeof TestThatFixture>) => this
  constructor(componentRef: ComponentRef<T>) {
    super(componentRef);
  }

  public dom = {
    queryTestId: <T extends Element>(testId: string) => {
      return (this.nativeElement as HTMLElement).querySelector<T>(
        `[testId='${testId}'`
      );
    },
  };

  public async preview(forSeconds: number = 0, background: string = '') {
    const previewWindow = document.querySelector<HTMLElement>('.test-preview')!;
    previewWindow.innerHTML = '';
    previewWindow.append(this.nativeElement);

    if (background != '') previewWindow.style.backgroundColor = background;

    // TODO make optional via run argument
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, forSeconds * 1000)
    );
  }
}

export async function testThatFixture<T>(
  component: Type<T>,
  moduleDef?: TestModuleMetadata
): Promise<TestThatFixture<T>> {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule(moduleDef ?? {});
  const fixture = TestBed.createComponent(component) as TestThatFixture<T>;
  (fixture as any).preview = TestThatFixture.prototype.preview;
  (fixture as any).dom = {
    queryTestId: <T extends Element>(testId: string) => {
      return (fixture.nativeElement as HTMLElement).querySelector<T>(
        `[testId='${testId}'`
      );
    },
  };
  fixture.detectChanges();
  return fixture;
}

export function createTestFixture<T>(component: Type<T>): TestThatFixture<T> {
  // This is stupid why is this necessary?
  const fixture = TestBed.createComponent(component) as TestThatFixture<T>;
  (fixture as any).preview = TestThatFixture.prototype.preview;
  return fixture;
}
