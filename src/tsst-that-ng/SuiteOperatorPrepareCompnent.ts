import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { SuiteOperator } from 'test-that';

export function componentTestBuilder<T>(fixture: ComponentFixture<T>) {
  return new ComponentTestBuilder<T>(fixture);
}

class ComponentTestBuilder<T> {
  componentType: Type<T>;

  constructor(private fixture: ComponentFixture<T>) {}

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

  async build(): Promise<SuiteOperator> {
    await TestBed.configureTestingModule({
      imports: [],
    });
    return {
      identifier: 'init',
      fn: async () => {
        this.fixture = TestBed.createComponent<T>(this.componentType);
      },
    };
  }
}
