declare global {
  export namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Read a query parameter from the current location or from a chained string or object with `toString` method.
       *
       * @param name The name of the query parameter.
       * @param defaultValue The value to return if the query parameter is not present on the subject. (optional)
       */
      param(name: string, defaultValue?: string): Chainable<string | null>
    }
  }
}

export {}
