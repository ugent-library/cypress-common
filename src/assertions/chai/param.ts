import { getParam } from "../../lib/param-helper.js";

declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Asserts that a URL string contains a query parameter with a value.
       *
       * @param name
       * @param value (optional)
       */
      param(name: string, value?: string | string[]): void;
    }
  }
}

chai.Assertion.addMethod(
  "param",
  function (name: string, value: string | string[] | null = null) {
    const negate = chai.util.flag(this, "negate") || false;
    if (negate && value) {
      throw new chai.AssertionError(
        "chai method param does not support negation",
      );
    }

    const param = getParam(this._obj, name);

    this.assert(
      param != null,
      `expected param '${name}' to exist`,
      `expected param '${name}' to not exist`,
      undefined,
    );

    if (value) {
      this.assert(
        Cypress._.isEqual(param, value),
        `expected param '${name}' to equal #{exp} but got #{act}`,
        `expected param '${name}' to not equal #{exp}`, // Unreachable, negation is not supported
        value,
        param,
      );
    }
  },
);
