declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Splits the subject string in multiple elements based on a delimiter.
       *
       * @param separator The separator pattern to split by. (default = empty string which splits every character)
       * @param filterEmptyElements Boolean indicating whether falsy values should be filtered from the yielded results. (default = false)
       */
      split(separator?: string | RegExp, filterEmptyElements?: boolean): Chainable<string[]>
    }
  }
}

export {}
