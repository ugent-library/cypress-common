declare module Chai {
  export interface Assertion {
    /**
     * Asserts that an HTML field is readonly.
     */
    readonly(): void;
  }
}
