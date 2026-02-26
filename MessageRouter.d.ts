import { MutexLock } from './MutexLock';

/**
 * Type alias for a message handler function.
 */
export type MessageHandler = (content: any) => void;

/**
 * A singleton class for message routing, using a mutex lock for thread safety.
 */
export declare class MessageRouter {
    static #instance: MessageRouter | null;
    #subscribers: Map<string, Set<MessageHandler>>;
    #lock: MutexLock;
    constructor();

    /**
     * Get the singleton instance of the MessageRouter class.
     * @returns {MessageRouter} The singleton instance.
     */
    static get instance(): MessageRouter;
    /**
     * Subscribe to a message type.
     * @param {string} messageType - The type of message to subscribe to.
     * @param {MessageHandler} handler - The message handler to call when a message of the specified type is sent.
     */
    subscribe(messageType: string, handler: MessageHandler): Promise<void>;
    /**
     * Send a message of a specific type.
     * @param {string} messageType - The type of message to send.
     * @param {*} content - The content of the message to send.
     */
    send(messageType: string, content: any): Promise<void>;
    /**
     * Unsubscribe from a message type.
     * @param {string} messageType - The type of message to unsubscribe from.
     * @param {MessageHandler} handler - The message handler to remove from the subscribers list.
     */
    unsubscribe(messageType: string, handler: MessageHandler): Promise<void>;
    /**
     * Clear all subscribers for a specific message type.
     * @param {string} messageType - The type of message to clear subscribers for.
     */
    clearSubscribers(messageType: string): Promise<void>;
    /**
     * Get the total number of subscribers across all message types.
     * @returns {number} The total number of subscribers.
     */
    getSubscriberCount(): Promise<number>;
}