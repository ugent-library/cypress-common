declare global {
  export namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Yields the (aggregate) sum of the chained elements.
       */
      sum(): Chainable<number>
    }
  }
}

export {}
