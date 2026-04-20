var getParam = require("../helpers/chai/param-helper").getParam;

Cypress.Commands.add(
  "param",
  { prevSubject: "optional" },
  (subject, name, defaultValue = null) => {
    let subj = null;
    const url = null;

    if (Cypress._.isNil(subject)) {
      subj = cy.location("search", { log: false });
    } else if (
      Cypress._.isObject(subject) &&
      Object.hasOwn(subject, "toString")
    ) {
      subj = cy.wrap(subject.toString(), { log: false });
    } else if (Cypress._.isObject(subject) && Object.hasOwn(subject, "url")) {
      subj = cy.wrap(subject.url, { log: false });
    } else if (Cypress._.isString(subject)) {
      subj = cy.wrap(subject, { log: false });
    } else {
      throw new Error(`Cannot get query parameter for ${subject}`);
    }

    return subj
      .then((url) => getParam(url, name))
      .then((yielded) => {
        const message = [name, yielded || "(default)"];

        Cypress.log({
          name: "param",
          message: message,
          consoleProps: () => ({
            subject: url,
            name,
            yielded,
            default: defaultValue,
          }),
        });

        return yielded || defaultValue;
      });
  },
);
