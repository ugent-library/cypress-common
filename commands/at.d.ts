declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields the element at index n of array. If n is negative, the nth element from the end is yielded.
       *
       * @param index The index of the element to yield.
       */
      at<T>(index: number): Chainable<T | undefined>
    }
  }
}

export {}
