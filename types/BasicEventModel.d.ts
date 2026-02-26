/**
 * A type for event arguments that can be any array of values.
 */
export type EventArgs = any[];

/**
 * A delegate type for event handlers that take any sender and event arguments.
 */
export type EventHandler = (sender: any, e: EventArgs) => void;

/**
 * A basic event model that allows registration and invocation of event handlers.
 */
export declare class BasicEventModel {
    #eventHandlers: EventHandler[];
    /**
     * Add an event handler to the event model.
     * @param {EventHandler} handler - The event handler to add.
     */
    addHandler(handler: EventHandler): void;
    /**
     * Remove an event handler from the event model.
     * @param {EventHandler} handler - The event handler to remove.
     */
    removeHandler(handler: EventHandler): void;
    /**
     * Raise the event from the event model, invoking all registered event handlers.
     * @param {any} sender - The event sender.
     * @param {EventArgs} e - The event arguments.
     */
    raiseEvent(sender: any, e: EventArgs): void;
}