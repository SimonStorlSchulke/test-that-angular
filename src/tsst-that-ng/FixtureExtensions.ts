import { ComponentRef, Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

export class TestThatFixture<T> extends ComponentFixture<T> {


    //override ['constructor']: new (...args: ConstructorParameters<typeof TestThatFixture>) => this
    constructor(componentRef: ComponentRef<T>) {
        super(componentRef);
    }

    public async preview(
        forSeconds: number = 0,
        background: string = ''
      ) {
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

export function createTestFixture<T>(component: Type<T>): TestThatFixture<T> {

    // This is stupid why is this necessary?
    const fixture = TestBed.createComponent(component) as TestThatFixture<T>;
    (fixture as any).preview = TestThatFixture.prototype.preview;
    return fixture;
}
