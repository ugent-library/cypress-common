import loupe from "loupe";
/**
 * Options object to suppress command logging.
 *
 * @example
 * cy.wrap(subject, NO_LOG);
 */
export const NO_LOG = Object.freeze({ log: false });
// Mutable console props per log, read lazily by the `consoleProps` callback set in logCommand
const consolePropsByLog = new WeakMap();
/**
 * Creates a Cypress command log entry.
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
export function logCommand(name, { message = "", consoleProps = {}, $el, } = {}) {
    const logOptions = {
        name,
        message,
    };
    const props = { ...consoleProps };
    logOptions.consoleProps = () => ({ props });
    if ($el) {
        logOptions.$el = $el;
    }
    const log = Cypress.log(logOptions);
    consolePropsByLog.set(log, props);
    return log;
}
/**
 * Appends a value to the message of a log entry. Strings are appended as-is, other values
 * (objects, arrays, numbers, ...) are formatted with loupe (using double quoted strings) and
 * truncated to 50 characters.
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
 * updateLogMessage(log, ["a", "b"]); // Message is now 'page, 2, ["a", "b"]'
 */
export function updateLogMessage(log, append, separator = ", ") {
    if (!log)
        return;
    const message = String(log.get("message") ?? "");
    const formatted = formatLogValue(append);
    log.set("message", message ? `${message}${separator}${formatted}` : formatted);
}
function formatLogValue(value) {
    if (typeof value === "string") {
        return value;
    }
    return (loupe(value, { truncate: 50, stylize: doubleQuoteStrings })
        // Drop the padding loupe adds inside the outer brackets: "[ 1, 2 ]" -> "[1, 2]",
        // "Set{ 1, 2 }" -> "Set{1, 2}"
        .replace(/^(\w*[[{]) | ([\]}])$/g, "$1$2"));
}
// loupe always single quotes strings, swap them for double quotes (and fix the escaping)
function doubleQuoteStrings(value, styleType) {
    if (styleType !== "string") {
        return value;
    }
    const content = value.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"');
    return `"${content}"`;
}
/**
 * Updates the console props of a log entry created with {@link logCommand}. Does nothing if
 * no log is passed or the log was not created with {@link logCommand}.
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
export function updateConsoleProps(log, update) {
    const props = log && consolePropsByLog.get(log);
    if (!props)
        return;
    if (typeof update === "function") {
        update(props);
    }
    else {
        Object.assign(props, update);
    }
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
export function addToConsoleProps(log, propertyKey) {
    return (yieldedResult) => {
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
export function addToLog(log, propertyKey, separator) {
    const addToProps = addToConsoleProps(log, propertyKey);
    return (yieldedResult) => {
        if (yieldedResult !== "" &&
            (isPrimitive(yieldedResult) ||
                (Array.isArray(yieldedResult) && yieldedResult.every(isPrimitive)))) {
            updateLogMessage(log, yieldedResult, separator);
        }
        return addToProps(yieldedResult);
    };
}
function isPrimitive(value) {
    return ["string", "number", "boolean"].includes(typeof value);
}
