/**
 * Options object to suppress command logging.
 *
 * @example
 * cy.wrap(subject, NO_LOG);
 */
export const NO_LOG = Object.freeze({ log: false } as const);

/**
 * Creates a command log entry. The display name is derived from the camelCase command name
 * (`"uniqueValues"` becomes `"UNIQUE VALUES"`, `"getURLParam"` becomes `"GET URL PARAM"`).
 * Console props are nested under a `props` key, which the other helpers in this module rely on.
 *
 * @param name The command name.
 * @param options Optional settings for the log entry.
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
 * Appends a value to the message of a log entry. Arrays are formatted as `[a, b]` and cut off
 * with `...` once their items exceed 50 characters, other values are converted with `String()`.
 * Does nothing if no log is passed.
 *
 * @param log The log to update.
 * @param append The value to append.
 * @param separator The separator between the existing message and the appended value.
 *
 * @example
 * const log = logCommand("param", { message: "page" });
 *
 * updateLogMessage(log, 2); // Message is now "page, 2"
 * updateLogMessage(log, ["a", "b"]); // Message is now "page, 2, [a, b]"
 */
export function updateLogMessage(
  log: Cypress.Log | undefined,
  append: unknown,
  separator: string = ", ",
) {
  if (!log) return;

  const message = String(log.get("message") ?? "");
  const formatted = formatLogValue(append);

  log.set(
    "message",
    message ? `${message}${separator}${formatted}` : formatted,
  );
}

const MAX_ARRAY_MESSAGE_LENGTH = 50;

function formatLogValue(value: unknown): string {
  if (!Array.isArray(value)) {
    return String(value);
  }

  const items: string[] = [];
  let length = 0;

  for (const item of value.map(formatLogValue)) {
    length += (items.length > 0 ? 2 : 0) + item.length;

    // Always keep the first item, so the message never ends up as just "[...]"
    if (items.length > 0 && length > MAX_ARRAY_MESSAGE_LENGTH) {
      items.push("...");
      break;
    }

    items.push(item);
  }

  return `[${items.join(", ")}]`;
}

/**
 * Updates the console props of a log entry created with {@link logCommand}. Does nothing if
 * no log is passed.
 *
 * @param log The log to update.
 * @param update Either an object with console props to add or overwrite, or a callback that
 * receives the console props object and may mutate it (e.g. to append to an existing value).
 *
 * @example
 * const log = logCommand("random", { consoleProps: { min, max, attempts: [] } });
 *
 * updateConsoleProps(log, { index, yielded });
 *
 * updateConsoleProps(log, (consoleProps) => {
 *   consoleProps.attempts.push(attempt);
 * });
 */
export function updateConsoleProps(
  log: Cypress.Log | undefined,
  update: Cypress.ObjectLike | ((consoleProps: Cypress.ObjectLike) => void),
) {
  if (!log) return;

  const consoleProps = log.get("consoleProps")?.() ?? {};
  consoleProps.props ??= {};

  if (typeof update === "function") {
    update(consoleProps.props);
  } else {
    Object.assign(consoleProps.props, update);
  }

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
    updateConsoleProps(log, { [propertyKey]: yieldedResult });

    return yieldedResult;
  };
}

/**
 * Like {@link addToConsoleProps}, but also appends the yielded value to the log message if it is
 * a (non-empty) string, number or boolean, or an array of those.
 *
 * @param log The log to update.
 * @param propertyKey The console props key to store the yielded value under.
 * @param separator The separator between the existing message and the yielded value. (default = ", ")
 * @returns A callback that passes through the yielded value.
 *
 * @example
 * const log = logCommand("param", { message: name, consoleProps: { name } });
 *
 * cy.location("search", NO_LOG)
 *   .then((search) => new URLSearchParams(search).get(name))
 *   .then(addToLog(log, "yielded", "=")); // With name "page" and "?page=2", the message becomes "page=2"
 */
export function addToLog<T>(
  log: Cypress.Log | undefined,
  propertyKey: string,
  separator?: string,
) {
  const addToProps = addToConsoleProps<T>(log, propertyKey);

  return (yieldedResult: T) => {
    if (
      yieldedResult !== "" &&
      (isPrimitive(yieldedResult) ||
        (Array.isArray(yieldedResult) && yieldedResult.every(isPrimitive)))
    ) {
      updateLogMessage(log, yieldedResult, separator);
    }

    return addToProps(yieldedResult);
  };
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return ["string", "number", "boolean"].includes(typeof value);
}
