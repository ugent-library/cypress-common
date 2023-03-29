declare global {
  export namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Yields a random element from the list of chained elements.
       *
       * @param lower The lower bound. (optional)
       * @param upper The upper bound. (optional)
       */
      random(lower?: number, upper?: number | null): Chainable<Subject>
    }
  }
}

export {}
