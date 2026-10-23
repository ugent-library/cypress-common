export declare function getParam(url: string, name: string): string | string[] | null;
/**
 * Extracts the query from a URL. A string without `?` is treated as a bare query (`a=1&b=2`),
 * unless it looks like a URL or path (it starts with a scheme, `/` or `.`), in which case it has no query.
 */
export declare function getQuery(url: string): string;
