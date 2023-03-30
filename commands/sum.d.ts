declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields the (aggregate) sum of the chained elements.
       */
      sum(): Chainable<number>
    }
  }
}

export {}
