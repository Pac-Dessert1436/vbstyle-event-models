"use strict";

/**
 * A simple mutex lock implementation using a queue.
 */
export class MutexLock {
    #locked = false;
    #waitingQueue = [];

    /**
     * Acquire the lock. If the lock is already held, queue the request.
     */
    async acquireLock() {
        // If lock is free, acquire it immediately
        if (!this.#locked) {
            this.#locked = true;
            return Promise.resolve();
        }

        // Otherwise, queue this request
        return new Promise(resolve => {
            this.#waitingQueue.push(resolve);
        });
    }

    /**
     * Release the lock. If there are waiting acquisitions, pass the lock to the next in line.
     */
    releaseLock() {
        if (!this.#locked && this.#waitingQueue.length === 0) {
            throw new Error("Lock is not held.");
        }

        // If there are waiting acquisitions, pass the lock to the next one
        if (this.#waitingQueue.length > 0) {
            /** @type {() => void} */
            const nextResolve = this.#waitingQueue.shift();
            // The lock remains locked, but now the next waiter has it
            // We don't set locked = false because it's immediately re-acquired
            nextResolve();
        } else {
            // No waiters, release the lock
            this.#locked = false;
        }
    }

    /**
     * Check if the lock is currently held.
     */
    get isLocked() {
        return this.#locked;
    }

    /**
     * Get the number of waiters.
     */
    get waiterCount() {
        return this.#waitingQueue.length;
    }
}