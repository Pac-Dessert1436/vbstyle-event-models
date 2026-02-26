# VB.NET-Style Event Models (TypeScript Edition)

A TypeScript library providing event models, message routing, and event scheduling utilities with thread safety, inspired by VB.NET's event model.

This library is now written in pure TypeScript with proper type definitions, ensuring type safety and better developer experience. It compiles to CommonJS modules for wide compatibility.

Install this package via NPM: `npm install vbstyle-event-models` (with TypeScript as a peer dependency, current version 1.0.8)

> NOTE: To compile a single TypeScript source file with this package imported in it, use this command on the terminal: `npx tsc [FILENAME].ts --lib "es2015,dom"`

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
const count = router.subscriberCount;
console.log('Total subscribers:', count);
```

### QueueEventScheduler

```typescript
import { QueueEventScheduler } from 'vbstyle-event-models';

// Create an event scheduler
const scheduler = new QueueEventScheduler();

// Schedule events
await scheduler.scheduleEvent((sender, e) => {
    console.log('Event 1 executed', { sender, args: e });
});

await scheduler.scheduleEvent((sender, e) => {
    console.log('Event 2 executed', { sender, args: e });
});

// Process all events
await scheduler.processEvents('sender', ['arg1', 'arg2']);

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