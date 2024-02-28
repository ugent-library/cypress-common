declare global {
  export namespace Cypress {
    interface Chainable {
      /**
       * Yields an object representing the search query.
       */
      params(): Chainable<Record<string, string | string[]>>;
    }
  }
}

export {};
