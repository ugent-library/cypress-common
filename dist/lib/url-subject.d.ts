/**
 * Resolves the subject of the `param` and `params` commands to a chainable URL (or query) string:
 * the current location if there is no subject, otherwise the subject itself, its `url` property or its `toString()` result.
 */
export declare function urlSubject(subject: unknown): Cypress.Chainable<string>;
