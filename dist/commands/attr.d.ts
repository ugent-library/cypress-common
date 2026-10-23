type AttrValue = string | number | null | ((index: number, attr: string) => string | number | void | undefined);
declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            /**
             * Get the value of a attribute for the first element in the set of matched elements. Invokes the jQuery attr method.
             *
             * @param attributeName The name of the attribute to get.
             */
            attr(attributeName: string): Chainable<string>;
            /**
             * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
             *
             * @param attributeName The name of the attribute to set.
             * @param value A value to set for the attribute, or `null` to remove it.
             */
            attr(attributeName: string, value: AttrValue): Chainable<Subject>;
            /**
             * Set one or more attributes for the set of matched elements. Invokes the jQuery attr method.
             *
             * @param attributes An object of attribute-value pairs to set.
             */
            attr(attributes: Record<string, unknown>): Chainable<Subject>;
        }
    }
}
export {};
