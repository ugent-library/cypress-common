import { IterateeShorthand } from 'cypress/types/lodash'

declare global {
  namespace Cypress {
    type Iteratee<T, U> = ((value: T, index: number | string, collection: T[]) => U) | IterateeShorthand<T>

    interface Chainable<Subject = any> {
      /**
       * Maps a set of chained elements using a lodash iteratee.
       *
       * @param iteratee The function invoked per iteration.
       */
      map<T, U>(iteratee: Iteratee<T, U>): Chainable<U[]>
    }
  }
}
