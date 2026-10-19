declare global {
    namespace Chai {
        interface Assertion {
            /**
             * Asserts that a DOM element is currently visible inside the browser viewport.
             *
             * @param window
             */
            inViewport(window: Window): void;
        }
    }
}
export {};
