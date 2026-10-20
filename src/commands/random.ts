import { logCommand, updateConsoleProps, updateLogMessage } from "../util";

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Yields a random element from the list of chained elements.
       */
      random<T = Subject>(): Chainable<Subject | null>;

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param upper The upper index bound.
       */
      random<T = Subject>(upper: number): Chainable<T | null>;

      /**
       * Yields a random element from the list of chained elements.
       *
       * @param lower The lower index bound.
       * @param upper The upper index bound.
       */
      random<T = Subject>(lower: number, upper: number): Chainable<T | null>;
    }
  }
}

type SubjectOperators = {
  length: number;
  keyFn: (index: number) => unknown;
  inFn: (index: number) => boolean;
  itemFn: (index: number) => unknown;
};

const COMMAND_NAME = "random";

Cypress.Commands.add(
  COMMAND_NAME,
  { prevSubject: true },
  (subject: unknown, lower: number = 0, upper: number | null = null) => {
    const log = logCommand(COMMAND_NAME, {
      consoleProps: { lower, upper, subject },
    });

    const { length, keyFn, inFn, itemFn } = determineSubjectOperators(subject);

    if (!lower && !upper) {
      lower = 0;
      upper = length - 1;
    } else if (!upper) {
      upper = lower;
      lower = 0;
    }

    const index = Cypress._.random(lower, upper);
    const key = keyFn(index);
    const yielded = inFn(index) ? itemFn(index) : null;

    updateLogMessage(log, `[${index}] => ${yielded}`);
    updateConsoleProps(log, { lower, upper, index, key, yielded });

    return yielded;
  },
);

function determineSubjectOperators(subject: unknown): SubjectOperators {
  if (subject && typeof subject === "object") {
    if (Array.isArray(subject)) {
      return {
        length: subject.length,
        keyFn: (i) => i,
        inFn: (i) => i in subject,
        itemFn: (i) => subject.at(i),
      };
    } else if (Cypress.dom.isJquery(subject)) {
      return {
        length: subject.length,
        keyFn: (i) => i,
        inFn: (i) => i < subject.length,
        itemFn: (i) => subject[i],
      };
    } else if (subject instanceof Map) {
      const keys = Array.from(subject.keys());
      return {
        length: subject.size,
        keyFn: (i) => keys.at(i),
        inFn: (i) => subject.has(keys.at(i)),
        itemFn: (i) => subject.get(keys.at(i)),
      };
    } else if (isIterable(subject)) {
      // Sets and other iterables
      const array = Array.from(subject);
      return {
        length: array.length,
        keyFn: (i) => i,
        inFn: (i) => i in array,
        itemFn: (i) => array.at(i),
      };
    }
  }

  throw new Error("Invalid subject");
}

function isIterable(value: object): value is Iterable<unknown> {
  return (
    Symbol.iterator in value && typeof value[Symbol.iterator] === "function"
  );
}

export {};
