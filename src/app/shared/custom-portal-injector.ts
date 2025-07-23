import { Injector, InjectionToken, Type } from '@angular/core';

/**
 * Simplified replacement for deprecated PortalInjector.
 */
export class CustomPortalInjector implements Injector {
  constructor(
    private parentInjector: Injector,
    private customTokens: WeakMap<any, any>
  ) {}

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T | null {
    const value = this.customTokens.get(token);

    if (value) return value;
    return this.parentInjector.get(token, notFoundValue);
  }
}
