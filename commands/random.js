Cypress.Commands.add(
  "random",
  { prevSubject: true },
  (subject, lower = 0, upper = null) => {
    const { length, keysFn, inFn, itemFn } = determineSubjectOperators(subject);

    if (!lower && !upper) {
      lower = 0;
      upper = length - 1;
    } else if (!upper) {
      upper = lower;
      lower = 0;
    }

    const index = Cypress._.random(lower, upper);
    const key = keysFn(index);
    const yielded = inFn(key) ? itemFn(key) : null;

    Cypress.log({
      name: "random",
      message: [`[${index}] => ${yielded}`],
      consoleProps: () => ({
        lower,
        upper,
        subject,
        index,
        key,
        yielded,
      }),
    });

    return yielded;
  },
);

function determineSubjectOperators(subject) {
  if (subject && typeof subject === "object") {
    if (Array.isArray(subject)) {
      return {
        length: subject.length,
        keysFn: (i) => i,
        inFn: (i) => i in subject,
        itemFn: (i) => subject.at(i),
      };
    } else if (typeof subject.jquery === "string") {
      return {
        length: subject.length,
        keysFn: (i) => i,
        inFn: (i) => i < subject.length,
        itemFn: (i) => subject[i],
      };
    } else if (subject instanceof Set) {
      const array = Array.from(subject);
      return {
        length: array.length,
        keysFn: (i) => i,
        inFn: (i) => i in array,
        itemFn: (i) => array.at(i),
      };
    } else if (subject instanceof Map) {
      return {
        length: subject.size,
        keysFn: (i) => Array.from(subject.keys()).at(i),
        inFn: (i) => subject.has(i),
        itemFn: (i) => subject.get(i),
      };
    } else if (typeof subject[Symbol.iterator] === "function") {
      // Other iterable
      const arrayFromSubject = Array.from(subject);
      return {
        length: arrayFromSubject.length,
        keysFn: (i) => i,
        inFn: (i) => i in arrayFromSubject,
        itemFn: (i) => arrayFromSubject.at(i),
      };
    }
  }

  throw new Error("Invalid subject");
}
