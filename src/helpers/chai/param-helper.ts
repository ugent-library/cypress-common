export function getParam(url: string, name: string): string | string[] | null {
  url = url.slice(url.indexOf("?")); // Only use the query

  const [first, ...others] = new URLSearchParams(url).getAll(name);

  if (first === undefined) {
    return null;
  }

  return others.length > 0 ? [first, ...others] : first;
}
