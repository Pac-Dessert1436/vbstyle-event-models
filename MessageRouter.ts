import { MutexLock } from "./MutexLock";

/**
 * A type alias for a message handler function.
 */
export type MessageHandler = (content: any) => void;

/**
 * A singleton class for message routing, using a mutex lock for thread safety.
 */
export class MessageRouter {
    private static _instance: MessageRouter | null = null;
    private _subscribers: Map<string, Set<MessageHandler>> = new Map();
    private _lock: MutexLock = new MutexLock();

    private constructor() {
        if (MessageRouter._instance) {
            throw new Error("Use MessageRouter.instance to get the singleton instance.");
        }
    }

    /**
     * Get the singleton instance of the MessageRouter class.
     * @returns {MessageRouter} The singleton instance.
     */
    public static get instance(): MessageRouter {
        if (!MessageRouter._instance) {
            MessageRouter._instance = new MessageRouter();
        }
        return MessageRouter._instance;
    }

    /**
     * Subscribe to a message type.
     * @param {string} messageType - The type of message to subscribe to.
     * @param {MessageHandler} handler - The message handler to call when a message of the specified type is sent.
     */
    public async subscribe(messageType: string, handler: MessageHandler): Promise<void> {
        await this._lock.acquireLock();
        try {
            if (!messageType) throw new Error("Message type cannot be empty.");
            if (typeof handler !== "function") throw new Error("Handler must be a function.");

            if (!this._subscribers.has(messageType)) {
                this._subscribers.set(messageType, new Set());
            }
            this._subscribers.get(messageType)!.add(handler);
        } finally {
            this._lock.releaseLock();
        }
    }

    /**
     * Send a message of a specific type.
     * @param {string} messageType - The type of message to send.
     * @param {*} content - The content of the message to send.
     */
    public async send(messageType: string, content: any): Promise<void> {
        let handlers: Set<MessageHandler> | null = null;

        await this._lock.acquireLock();
        try {
            if (!messageType) throw new Error("Message type cannot be empty.");

            if (this._subscribers.has(messageType)) {
                handlers = this._subscribers.get(messageType)!
            }
        } finally {
            this._lock.releaseLock();
        }

        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(content);
                } catch (ex) {
                    // Log but don't crash the message pump
                    console.debug(`Handler error: ${(ex as Error).message}`);
                }
            }
        }
    }

    /**
     * Unsubscribe from a message type.
     * @param {string} messageType - The type of message to unsubscribe from.
     * @param {MessageHandler} handler - The message handler to remove from the subscribers list.
     */
    public async unsubscribe(messageType: string, handler: MessageHandler): Promise<void> {
        await this._lock.acquireLock();
        try {
            if (this._subscribers.has(messageType)) {
                const handlers = this._subscribers.get(messageType)!;
                if (handlers.has(handler)) {
                    handlers.delete(handler);
                }
            }
        } finally {
            this._lock.releaseLock();
        }
    }

    /**
     * Clear all subscribers for a specific message type.
     * @param {string} messageType - The type of message to clear subscribers for.
     */
    public async clearSubscribers(messageType: string): Promise<void> {
        await this._lock.acquireLock();
        try {
            if (this._subscribers.has(messageType)) {
                const handlers = this._subscribers.get(messageType)!;
                // Clear the handlers set
                handlers.clear();
            }
        } finally {
            this._lock.releaseLock();
        }
    }

    /**
     * Get the total number of subscribers across all message types.
     * @returns {number} The total number of subscribers.
     */
    public get subscriberCount(): number {
        let count = 0;
        for (const handlers of this._subscribers.values()) {
            count += handlers.size;
        }
        return count;
    }
}