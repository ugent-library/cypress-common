declare module Chai {
  export interface Assertion {
    /**
     * Asserts that a URL string contains a query parameter with a value.
     *
     * @param name
     * @param value (optional)
     */
    param(name: string, value?: string | string[]): void;
  }
}
