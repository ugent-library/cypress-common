declare global {
    namespace Chai {
        interface Assertion {
            /**
             * Asserts that an HTML field is readonly.
             */
            readonly(): void;
        }
    }
}
export {};
