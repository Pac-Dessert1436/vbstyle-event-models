/**
 * A simple mutex lock implementation using a queue.
 */
export declare class MutexLock {
    #locked: boolean;
    #waitingQueue: Promise<void>[];
    
    /**
     * Acquire the lock. If the lock is already held, queue the request.
     */
    async acquireLock(): Promise<void>;
    /**
     * Release the lock. If there are waiting acquisitions, pass the lock to the next in line.
     */
    releaseLock(): void;
    /**
     * Check if the lock is currently held.
     */
    get isLocked(): boolean;
    /**
     * Get the number of waiters.
     */
    get waiterCount(): number;
}