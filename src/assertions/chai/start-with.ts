declare global {
  namespace Chai {
    interface Assertion {
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
}

chai.Assertion.addProperty("start", function () {
  return {
    with: (substring: string) => {
      this.assert(
        Cypress._.startsWith(this._obj, substring),
        "expected #{this} to start with #{exp}",
        "expected #{this} to not start with #{exp}",
        substring,
      );
    },
  };
});

export {};
