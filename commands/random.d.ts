declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields a random element from the list of chained elements.
       */
      random<T>(): Chainable<T | null>

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param upper The upper index bound.
       */
      random<T>(upper: number): Chainable<T | null>

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param lower The lower index bound.
       * @param upper The upper index bound.
       */
      random<T>(lower: number, upper: number): Chainable<T | null>
    }
  }
}

export {}
