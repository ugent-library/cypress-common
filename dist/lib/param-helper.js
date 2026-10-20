"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = getParam;
exports.getQuery = getQuery;
function getParam(url, name) {
    const [first, ...others] = new URLSearchParams(getQuery(url)).getAll(name);
    if (first === undefined) {
        return null;
    }
    return others.length > 0 ? [first, ...others] : first;
}
/**
 * Extracts the query from a URL. A string without `?` is treated as a bare query (`a=1&b=2`),
 * unless it looks like a URL or path (it starts with a scheme, `/` or `.`), in which case it has no query.
 */
function getQuery(url) {
    const index = url.indexOf("?");
    if (index >= 0) {
        return url.slice(index);
    }
    return /^([a-z][a-z\d+.-]*:|[/.])/i.test(url) ? "" : url;
}
