"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_LOG = void 0;
exports.logCommand = logCommand;
exports.updateLogMessage = updateLogMessage;
exports.updateConsoleProps = updateConsoleProps;
exports.addToConsoleProps = addToConsoleProps;
exports.addToLog = addToLog;
/**
 * Options object to suppress command logging.
 *
 * @example
 * cy.wrap(subject, NO_LOG);
 */
exports.NO_LOG = Object.freeze({ log: false });
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
function logCommand(name, { message = "", consoleProps = {}, $el, } = {}) {
    const logOptions = {
        name,
        displayName: name,
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
function updateLogMessage(log, append, separator = ", ") {
    if (!log)
        return;
    const message = String(log.get("message") ?? "");
    const formatted = formatLogValue(append);
    log.set("message", message ? `${message}${separator}${formatted}` : formatted);
}
const MAX_ARRAY_MESSAGE_LENGTH = 50;
function formatLogValue(value) {
    if (!Array.isArray(value)) {
        return String(value);
    }
    const items = [];
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
function updateConsoleProps(log, update) {
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
function addToConsoleProps(log, propertyKey) {
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
function addToLog(log, propertyKey, separator) {
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
