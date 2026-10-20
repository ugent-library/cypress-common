import { logCommand, updateConsoleProps, updateLogMessage } from "../util";
import { urlSubject } from "./url-subject";

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

Cypress.Commands.add(
  "params",
  { prevSubject: "optional" },
  (subject: unknown) => {
    const log = logCommand("params");

    return urlSubject(subject).then((url) => {
      updateConsoleProps(log, { subject: url });

      const paramsEntries = new URLSearchParams(
        url.slice(url.indexOf("?")),
      ).entries();

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
