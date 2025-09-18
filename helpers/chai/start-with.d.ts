declare module Chai {
  export interface Assertion {
    /**
     * Asserts that a string starts with a substring.
     */
    start: {
      /**
       * Asserts that a string starts with a substring.
       *
       * @param substring
       */
      with(substring: string): void;
    };
  }
}
