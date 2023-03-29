declare module Chai {
  export interface Assertion {
    /**
     * Asserts that a string ends with a substring.
     */
    end: {
      /**
       * Asserts that a string ends with a substring.
       *
       * @param substring
       */
      with(substring: string): void
    }
  }
}
