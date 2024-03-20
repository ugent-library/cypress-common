declare global {
  export namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Yields a random element from the list of chained elements.
       */
      random<T = Subject>(): Chainable<Subject | null>;

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param upper The upper index bound.
       */
      random<T = Subject>(upper: number): Chainable<T | null>;

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param lower The lower index bound.
       * @param upper The upper index bound.
       */
      random<T = Subject>(lower: number, upper: number): Chainable<T | null>;
    }
  }
}

export {};
