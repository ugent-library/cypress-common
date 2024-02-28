Cypress.Commands.add("params", { prevSubject: "optional" }, (subject) => {
  let subj = null;
  let url = null;

  if (Cypress._.isNil(subject)) {
    subj = cy.location("search", { log: false });
  } else if (
    Cypress._.isObject(subject) &&
    subject.hasOwnProperty("toString")
  ) {
    subj = cy.wrap(subject.toString(), { log: false });
  } else if (Cypress._.isObject(subject) && subject.hasOwnProperty("url")) {
    subj = cy.wrap(subject.url, { log: false });
  } else if (Cypress._.isString(subject)) {
    subj = cy.wrap(subject, { log: false });
  } else {
    throw new Error(`Cannot get query parameter for ${subject}`);
  }

  return subj
    .then((url) =>
      {
      const paramsEntries = new URLSearchParams(url.slice(url.indexOf("?")))
        .entries();
        
        return [...paramsEntries]
          .reduce((previous, [name, value]) => {
            if (name in previous) {
              if (!Array.isArray(previous[name])) {
                previous[name] = [previous[name]];
              }

              previous[name].push(value);
            } else {
              previous[name] = value;
            }

            return previous;
          }, {});
      }
    )
    .then((yielded) => {
      const message = [yielded];

      Cypress.log({
        name: "params",
        message: message,
        consoleProps: () => ({
          subject: url,
          yielded,
        }),
      });

      return yielded;
    });
});
