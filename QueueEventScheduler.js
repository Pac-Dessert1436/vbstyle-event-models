"use strict";
import { MutexLock } from "./MutexLock.js";

/**
 * @import { EventArgs, EventHandler } from "./BasicEventModel.js";
 */

/**
 * A simple event scheduler that uses a queue and a mutex lock for thread safety.
 */
export class QueueEventScheduler {
    #eventQueue = [];
    #lock = new MutexLock();

    constructor() {
    }

    /**
     * Schedule an event to be processed.
     * @param {EventHandler} event - The event to be processed.
     */
    async scheduleEvent(event) {
        await this.#lock.acquireLock();
        try {
            this.#eventQueue.push(event);
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Process all events in the queue.
     * @param {*} sender - The sender of the event.
     * @param {EventArgs} e - The event arguments.
     */
    async processEvents(sender, e) {
        if (this.#eventQueue.length === 0) {
            return;
        }

        await this.#lock.acquireLock();
        try {
            while (this.#eventQueue.length > 0) {
                const event = this.#eventQueue.shift();
                event?.(sender, e);
            }
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Clear all pending events.
     */
    async clearEvents() {
        await this.#lock.acquireLock();
        try {
            this.#eventQueue = [];
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Get the number of pending events.
     * @returns {number} The number of pending events.
     */
    get pendingEventCount() {
        return this.#eventQueue.length;
    }
}