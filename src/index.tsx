import { useRef, useSyncExternalStore } from 'react';
import store from './store';

export function useState<T>(
  initialValue?: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // We need useRef to persist the unique index for each useState instance.
  const indexRef = useRef<number | null>(null);

  if (indexRef.current === null) {
    // Assign the current index based on the current length of the state array.
    // This ensures that each useState call gets a unique, sequential index.
    indexRef.current = store.state.length;
    if (store.state[indexRef.current] === undefined) {
      // If this is the first time this useState is called, initialize its state slot with the provided initial value.
      store.state[indexRef.current] = initialValue;
      // Initialize lastSnapshot to a shallow copy of the state array,
      // so React can track the initial state for all hooks.
      store.lastSnapshot = [...store.state];
    }
  }

  // Assign the current index from indexRef. This value is fixed for each useState instance.
  // This way setValue will always have the corect index value assigned to each useState instance.
  const index = indexRef.current;

  const setValue = (value: T | ((prev: T) => T)) => {
    const nextValue =
      typeof value === 'function'
        ? (value as (prev: T) => T)(store.state[index])
        : value;

    if (nextValue !== store.state[index]) {
      store.state[index] = nextValue;
      // Update lastSnapshot to a new shallow copy of the state array after a value changes.
      // This triggers React to re-evaluate the snapshot and re-render if needed.
      store.lastSnapshot = [...store.state];
      store.listeners.forEach((listener) => listener());
    }
  };

  const snapshot = useSyncExternalStore(
    (listener) => {
      store.listeners.add(listener);
      return () => store.listeners.delete(listener);
    },
    // useSyncExternalStore will call this function to get the current snapshot.
    // React compares the returned array (lastSnapshot) by reference to decide if a re-render is needed.
    () => store.lastSnapshot
  );

  return [snapshot[index], setValue];
}
