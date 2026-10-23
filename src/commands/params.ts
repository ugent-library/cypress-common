import { getQuery } from "../lib/param-helper.js";
import { urlSubject } from "../lib/url-subject.js";
import {
  logCommand,
  updateConsoleProps,
  updateLogMessage,
} from "../util/index.js";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Yields an object representing the search query.
       */
      params(): Chainable<Record<string, string | string[]>>;
    }
  }
}

const COMMAND_NAME = "params";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: "optional" },
  (subject: unknown) => {
    const log = logCommand(COMMAND_NAME);

    return urlSubject(subject).then((url) => {
      updateConsoleProps(log, { subject: url });

      const paramsEntries = new URLSearchParams(getQuery(url)).entries();

      const yielded = [...paramsEntries].reduce<
        Record<string, string | string[]>
      >((previous, [name, value]) => {
        const existing = previous[name];

        if (existing === undefined) {
          previous[name] = value;
        } else if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          previous[name] = [existing, value];
        }

        return previous;
      }, {});

      updateLogMessage(log, Object.keys(yielded));
      updateConsoleProps(log, { yielded });

      return yielded;
    });
  },
);
