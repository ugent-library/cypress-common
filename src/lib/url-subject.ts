import { NO_LOG } from "../util/index.js";

/**
 * Resolves the subject of the `param` and `params` commands to a chainable URL (or query) string:
 * the current location if there is no subject, otherwise the subject itself, its `url` property or its `toString()` result.
 */
export function urlSubject(subject: unknown): Cypress.Chainable<string> {
  if (Cypress._.isNil(subject)) {
    return cy.location("search", NO_LOG);
  } else if (
    Cypress._.isObject(subject) &&
    Object.hasOwn(subject, "toString")
  ) {
    return cy.wrap(subject.toString(), NO_LOG);
  } else if (
    Cypress._.isObject(subject) &&
    "url" in subject &&
    Object.hasOwn(subject, "url")
  ) {
    return cy.wrap(String(subject.url), NO_LOG);
  } else if (Cypress._.isString(subject)) {
    return cy.wrap(subject, NO_LOG);
  } else {
    throw new Error(`Cannot get query parameter for ${subject}`);
  }
}
