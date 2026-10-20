declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Asserts that a string ends with a substring.
       */
      end: {
        /**
         * Asserts that a string ends with a substring.
         *
         * @param substring
         */
        with(substring: string): void;
      };
    }
  }
}

chai.Assertion.addProperty("end", function () {
  return {
    with: (substring: string) => {
      this.assert(
        Cypress._.endsWith(this._obj, substring),
        "expected #{this} to end with #{exp}",
        "expected #{this} to not end with #{exp}",
        substring,
      );
    },
  };
});

export {};
