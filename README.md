# VB.NET-Style Event Models (JavaScript/TypeScript Edition)

A JavaScript/TypeScript library providing event models, message routing, and event scheduling utilities with thread safety, inspired by VB.NET's event model.

> NOTE: This library was written in pure TypeScript initially but underwent packaging issues, so it's now rewritten in JavaScript with TypeScript declaration files provided for type support. *__Version 1.0.5 only works in JavaScript (CommonJS) with no TypeScript support, so if you're using TypeScript, please upgrade to version 1.0.6 or later.__*

Install this package via NPM: `npm install vbstyle-event-models` (no other dependencies required, current version 1.0.6, now changed to an **ES module**)

## Features

- **BasicEventModel**: A simple event model for registering and invoking event handlers
- **MessageRouter**: A singleton message router for publish-subscribe pattern
- **QueueEventScheduler**: A queue-based event scheduler with thread safety
- **MutexLock**: A simple mutex lock implementation for thread safety

## Usage

### BasicEventModel

```typescript
import { BasicEventModel, EventHandler, EventArgs } from 'vbstyle-event-models';

// Create an event model
const eventModel = new BasicEventModel();

// Define an event handler
const handler: EventHandler = (sender, e) => {
    console.log('Event triggered:', { sender, args: e });
};

// Add the handler
eventModel.addHandler(handler);

// Raise the event
eventModel.raiseEvent('sender', ['arg1', 'arg2']);

// Remove the handler
eventModel.removeHandler(handler);
```

### MessageRouter

```typescript
import { MessageRouter } from 'vbstyle-event-models';

// Get the singleton instance
const router = MessageRouter.instance;

// Subscribe to a message type
await router.subscribe('userCreated', (user) => {
    console.log('User created:', user);
});

// Send a message
await router.send('userCreated', { id: 1, name: 'John' });

// Unsubscribe from a message type
await router.unsubscribe('userCreated', handler);

// Clear all subscribers for a message type
await router.clearSubscribers('userCreated');

// Get total subscriber count
const count = await router.getSubscriberCount();
console.log('Total subscribers:', count);
```

### QueueEventScheduler

```typescript
import { QueueEventScheduler } from 'vbstyle-event-models';

// Create an event scheduler
const scheduler = new QueueEventScheduler();

// Schedule events
await scheduler.scheduleEvent(() => {
    console.log('Event 1 executed');
});

await scheduler.scheduleEvent(() => {
    console.log('Event 2 executed');
});

// Process all events
await scheduler.processEvents();

// Clear pending events
await scheduler.clearEvents();

// Get pending event count
const count = scheduler.pendingEventCount;
console.log('Pending events:', count);
```

### MutexLock

```typescript
import { MutexLock } from 'vbstyle-event-models';

// Create a mutex lock
const lock = new MutexLock();

// Acquire the lock
await lock.acquireLock();
try {
    // Critical section
    console.log('Lock acquired');
} finally {
    // Release the lock
    lock.releaseLock();
    console.log('Lock released');
}

// Check if locked
console.log('Is locked:', lock.isLocked);

// Get waiter count
console.log('Waiters:', lock.waiterCount);
```

## License

[BSD 3-Clause](LICENSE)