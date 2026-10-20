export function getParam(url: string, name: string): string | string[] | null {
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
export function getQuery(url: string): string {
  const index = url.indexOf("?");

  if (index >= 0) {
    return url.slice(index);
  }

  return /^([a-z][a-z\d+.-]*:|[/.])/i.test(url) ? "" : url;
}
