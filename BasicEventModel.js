"use strict";
/**
 * @typedef {any[]} EventArgs A type for event arguments that can be any array of values.
 */

/**
 * @typedef {(sender: any, e: EventArgs) => void} EventHandler
 * A delegate type for event handlers that take any sender and event arguments.
 */

/**
 * A basic event model that allows registration and invocation of event handlers.
 */
export class BasicEventModel {
    #eventHandlers = [];

    /**
     * Add an event handler to the event model.
     */
    addHandler(handler) {
        this.#eventHandlers.push(handler);
    }

    /**
     * Remove an event handler from the event model.
     */
    removeHandler(handler) {
        this.#eventHandlers = this.#eventHandlers.filter(h => h !== handler);
    }

    /**
     * Raise the event from the event model, invoking all registered event handlers.
     */
    raiseEvent(sender, e) {
        this.#eventHandlers.forEach(handler => handler(sender, e));
    }
}