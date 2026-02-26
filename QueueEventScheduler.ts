import { MutexLock } from "./MutexLock";
import { EventArgs, EventHandler } from "./BasicEventModel";

/**
 * A simple event scheduler that uses a queue and a mutex lock for thread safety.
 */
export class QueueEventScheduler {
    private eventQueue: EventHandler[] = [];
    private lock: MutexLock = new MutexLock();

    /**
     * Schedule an event to be processed.
     * @param {EventHandler} event - The event to be processed.
     */
    public async scheduleEvent(event: EventHandler): Promise<void> {
        await this.lock.acquireLock();
        try {
            this.eventQueue.push(event);
        } finally {
            this.lock.releaseLock();
        }
    }

    /**
     * Process all events in the queue.
     * @param {*} sender - The sender of the event.
     * @param {EventArgs} e - The event arguments.
     */
    public async processEvents(sender: any, e: EventArgs): Promise<void> {
        if (this.eventQueue.length === 0) {
            return;
        }

        await this.lock.acquireLock();
        try {
            while (this.eventQueue.length > 0) {
                const event = this.eventQueue.shift()!;
                event(sender, e);
            }
        } finally {
            this.lock.releaseLock();
        }
    }

    /**
     * Clear all pending events.
     */
    public async clearEvents(): Promise<void> {
        await this.lock.acquireLock();
        try {
            this.eventQueue = [];
        } finally {
            this.lock.releaseLock();
        }
    }

    /**
     * Get the number of pending events.
     * @returns {number} The number of pending events.
     */
    public get pendingEventCount(): number {
        return this.eventQueue.length;
    }
}