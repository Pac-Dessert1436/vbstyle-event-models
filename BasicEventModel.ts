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
export class BasicEventModel {
    private eventHandlers: EventHandler[] = [];

    /**
     * Add an event handler to the event model.
     * @param {EventHandler} handler - The event handler to add.
     */
    public addHandler(handler: EventHandler): void {
        this.eventHandlers.push(handler);
    }

    /**
     * Remove an event handler from the event model.
     * @param {EventHandler} handler - The event handler to remove.
     */
    public removeHandler(handler: EventHandler): void {
        this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    }

    /**
     * Raise the event from the event model, invoking all registered event handlers.
     * @param {any} sender - The event sender.
     * @param {EventArgs} e - The event arguments.
     */
    public raiseEvent(sender: any, e: EventArgs): void {
        this.eventHandlers.forEach(handler => handler(sender, e));
    }
}