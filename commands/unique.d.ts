declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields the subject without any duplicates.
       *
       * @param sorted Boolean indicating whether the yielded array should also be sorted. (default = false)
       */
      unique(sorted?: boolean): Chainable<[]>
    }
  }
}

export {}
