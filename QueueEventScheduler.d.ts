import { EventArgs, EventHandler } from "./BasicEventModel";
import { MutexLock } from "./MutexLock";

/**
 * A simple event scheduler that uses a queue and a mutex lock for thread safety.
 */
export declare class QueueEventScheduler {
    #eventQueue: EventHandler[];
    #lock: MutexLock;

    /**
     * Schedule an event to be processed.
     * @param {EventHandler} event - The event to be processed.
     */
    scheduleEvent(event: EventHandler): Promise<void>;
    /**
     * Process all events in the queue.
     */
    processEvents(sender: any, e: EventArgs): Promise<void>;
    /**
     * Clear all pending events.
     */
    clearEvents(): Promise<void>;
    /**
     * Get the number of pending events.
     * @returns {number} The number of pending events.
     */
    get pendingEventCount(): number;
}