"use strict";
import { MutexLock } from "./MutexLock.js";

/**
 * @typedef {(content: any) => void} MessageHandler Type alias for a message handler function.
 */

/**
 * A singleton class for message routing, using a mutex lock for thread safety.
 */
export class MessageRouter {
    static #instance = null;
    #subscribers = new Map();
    #lock = new MutexLock();

    constructor() {
        if (MessageRouter.#instance)
            throw new Error("Use MessageRouter.instance to get the singleton instance.");
    }

    /**
     * Get the singleton instance of the MessageRouter class.
     * @returns {MessageRouter} The singleton instance.
     */
    static get instance() {
        if (!MessageRouter.#instance)
            MessageRouter.#instance = new MessageRouter();

        return MessageRouter.#instance;
    }

    /**
     * Subscribe to a message type.
     * @param {string} messageType - The type of message to subscribe to.
     * @param {MessageHandler} handler - The message handler to call when a message of the specified type is sent.
     */
    async subscribe(messageType, handler) {
        await this.#lock.acquireLock();
        try {
            if (!messageType) throw new Error("Message type cannot be empty.");
            if (typeof handler !== "function") throw new Error("Handler must be a function.");

            if (!this.#subscribers.has(messageType)) {
                this.#subscribers.set(messageType, new Set());
            }
            this.#subscribers.get(messageType).add(handler);
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Send a message of a specific type.
     * @param {string} messageType - The type of message to send.
     * @param {*} content - The content of the message to send.
     */
    async send(messageType, content) {
        let handlers = null;

        await this.#lock.acquireLock();
        try {
            if (!messageType) throw new Error("Message type cannot be empty.");

            if (this.#subscribers.has(messageType)) {
                handlers = this.#subscribers.get(messageType);
            }
        } finally {
            this.#lock.releaseLock();
        }

        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(content);
                } catch (ex) {
                    // Log but don't crash the message pump
                    console.debug(`Handler error: ${ex.message}`);
                }
            }
        }
    }

    /**
     * Unsubscribe from a message type.
     * @param {string} messageType - The type of message to unsubscribe from.
     * @param {MessageHandler} handler - The message handler to remove from the subscribers list.
     */
    async unsubscribe(messageType, handler) {
        await this.#lock.acquireLock();
        try {
            if (this.#subscribers.has(messageType)) {
                /** @type {Set<MessageHandler>} */
                const handlers = this.#subscribers.get(messageType);
                if (handlers.has(handler))
                    handlers.delete(handler);
            }
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Clear all subscribers for a specific message type.
     * @param {string} messageType - The type of message to clear subscribers for.
     */
    async clearSubscribers(messageType) {
        await this.#lock.acquireLock();
        try {
            if (this.#subscribers.has(messageType)) {
                /** @type {Set<MessageHandler>} */
                const handlers = this.#subscribers.get(messageType);
                // Clear the handlers set
                handlers.clear();
            }
        } finally {
            this.#lock.releaseLock();
        }
    }

    /**
     * Get the total number of subscribers across all message types.
     * @returns {number} The total number of subscribers.
     */
    get subscriberCount() {
        let count = 0;
        for (const handlers of this.#subscribers.values()) {
            count += handlers.length;
        }
        return count;
    }
}