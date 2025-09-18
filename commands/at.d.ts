declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields the element at index n (zero-based) of "array-likes". If n is negative, the n-th element from the end is yielded.
       *
       * @param index The index of the element to yield.
       */
      at<T>(index: number): Chainable<T | undefined>;
    }
  }
}

export {};
