/**
 * Options object to suppress command logging.
 *
 * @example
 * cy.wrap(subject, NO_LOG);
 */
export const NO_LOG = { log: false };

/**
 * Creates a command log entry. The display name is derived from the camelCase command name
 * (`"uniqueValues"` becomes `"UNIQUE VALUES"`, `"getURLParam"` becomes `"GET URL PARAM"`). Console props are nested under a `props` key,
 * which the other helpers in this module rely on.
 *
 * @param name The command name.
 * @param options.message The message shown in the command log.
 * @param options.consoleProps Initial console props, shown when clicking the log entry.
 * @param options.$el An optional element to highlight when the log entry is selected.
 * @returns The created log, to be updated later with the other helpers in this module.
 *
 * @example
 * Cypress.Commands.add("sum", { prevSubject: true }, (subject: number[]) => {
 *   const log = logCommand("sum", { consoleProps: { subject } });
 *
 *   return cy.wrap(Cypress._.sum(subject), NO_LOG).then(addToLog(log, "yielded"));
 * });
 */
export function logCommand(
  name: string,
  {
    message = "",
    consoleProps = {},
    $el,
  }: {
    message?: unknown;
    consoleProps?: Cypress.ObjectLike;
    $el?: JQuery;
  } = {},
) {
  const logOptions: Partial<Cypress.LogConfig> = {
    name,
    displayName: name
      .replace(/([a-z\d])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .toUpperCase(),
    message,
    consoleProps: () => ({ props: consoleProps }),
  };

  if ($el) {
    logOptions.$el = $el;
  }

  return Cypress.log(logOptions);
}

/**
 * Appends a value to the message of a log entry. Does nothing if no log is passed.
 *
 * @param log The log to update.
 * @param append The value to append.
 * @param separator The separator between the existing message and the appended value.
 *
 * @example
 * const log = logCommand("param", { message: "page" });
 *
 * updateLogMessage(log, 2); // Message is now "page, 2"
 */
export function updateLogMessage(
  log: Cypress.Log | undefined,
  append: unknown,
  separator: string = ", ",
) {
  if (!log) return;

  const message = String(log.get("message") ?? "");

  log.set(
    "message",
    message ? `${message}${separator}${String(append)}` : String(append),
  );
}

/**
 * Updates the console props of a log entry created with {@link logCommand}. Does nothing if
 * no log is passed.
 *
 * @param log The log to update.
 * @param callback Receives the console props object, which may be mutated.
 *
 * @example
 * const log = logCommand("random", { consoleProps: { min, max } });
 *
 * updateConsoleProps(log, (consoleProps) => {
 *   consoleProps.attempts = attempts;
 * });
 */
export function updateConsoleProps(
  log: Cypress.Log | undefined,
  callback: (consoleProps: Cypress.ObjectLike) => void,
) {
  if (!log) return;

  const consoleProps = log.get("consoleProps")?.() ?? {};
  consoleProps.props ??= {};

  callback(consoleProps.props);

  log.set({ consoleProps: () => consoleProps });
}

/**
 * Creates a `.then()` callback that adds the yielded value to the console props of a log entry
 * and yields it unchanged.
 *
 * @param log The log to update.
 * @param propertyKey The console props key to store the yielded value under.
 * @returns A callback that passes through the yielded value.
 *
 * @example
 * const log = logCommand("attr", { consoleProps: { name } });
 *
 * cy.wrap(subject, NO_LOG)
 *   .invoke(NO_LOG, "attr", name)
 *   .then(addToConsoleProps(log, "yielded"));
 */
export function addToConsoleProps<T>(
  log: Cypress.Log | undefined,
  propertyKey: string,
) {
  return (yieldedResult: T) => {
    updateConsoleProps(log, (consoleProps) => {
      consoleProps[propertyKey] = yieldedResult;
    });

    return yieldedResult;
  };
}

/**
 * Like {@link addToConsoleProps}, but also appends the yielded value to the log message if it is
 * a (non-empty) string, number or boolean.
 *
 * @param log The log to update.
 * @param propertyKey The console props key to store the yielded value under.
 * @returns A callback that passes through the yielded value.
 *
 * @example
 * const log = logCommand("param", { message: name, consoleProps: { name } });
 *
 * cy.location("search", NO_LOG)
 *   .then((search) => new URLSearchParams(search).get(name))
 *   .then(addToLog(log, "yielded")); // Message becomes e.g. "page, 2"
 */
export function addToLog<T>(log: Cypress.Log | undefined, propertyKey: string) {
  const addToProps = addToConsoleProps<T>(log, propertyKey);

  return (yieldedResult: T) => {
    if (
      ["string", "number", "boolean"].includes(typeof yieldedResult) &&
      yieldedResult !== ""
    ) {
      updateLogMessage(log, yieldedResult);
    }

    return addToProps(yieldedResult);
  };
}
