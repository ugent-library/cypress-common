declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Asserts that an HTML field is readonly.
       */
      readonly(): void;
    }
  }
}

chai.Assertion.addProperty("readonly", function () {
  this.assert(
    this._obj[0].readOnly,
    "expected #{this} to be read-only",
    "expected #{this} to not be read-only",
    undefined,
  );
});

export {};
