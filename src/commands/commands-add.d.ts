// Compile-time only typings for this package's sources, not shipped in dist.

declare namespace Cypress {
  /**
   * The subject type yielded by a custom command, as declared on `Chainable`.
   */
  type YieldedSubject<T extends keyof ChainableMethods> =
    ReturnType<ChainableMethods[T]> extends Chainable<infer Y> ? Y : never;

  interface Commands {
    /**
     * Add a custom child or dual command that returns a plain value instead of a `Chainable`.
     *
     * Cypress wraps such a return value as the new subject, but its own typings only accept a `Chainable` as return value.
     * The returned value is checked against the subject type that the command declares on `Chainable`.
     *
     * @see https://on.cypress.io/api/commands
     */
    add<T extends keyof Chainable, S>(
      name: T,
      options: CommandOptions & {
        prevSubject: true | PrevSubject | PrevSubject[];
      },
      fn: (
        this: Mocha.Context,
        prevSubject: S,
        ...args: Parameters<ChainableMethods[T]>
      ) => YieldedSubject<T> | Chainable<YieldedSubject<T>>,
    ): void;
  }
}
