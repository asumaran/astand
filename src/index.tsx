import { useSyncExternalStore } from 'react';

// Global state storage - shared across all hook instances
let state: any;
// Set of listener functions that React calls when checking for state changes
let listeners = new Set<() => void>();

/**
 * Subscription function for useSyncExternalStore
 * React calls this to register/unregister for state change notifications
 * @param listener - Function that React provides to notify about potential state changes
 * @returns Cleanup function to unsubscribe the listener
 */
function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Updates global state and notifies React about the change
 * @param newPartialState - The new state value
 */
function setState<T>(newPartialState: T) {
  // Update the global state
  state = newPartialState;
  // Notify React that state might have changed by calling all listeners
  // React will then call getSnapshot to check if the value actually changed
  listeners.forEach((listener) => listener());
}

// Type for state setter function that accepts either a value or an updater function
type SetterFunction<T> = (newValue: T | ((prevValue: T) => T)) => void;

/**
 * Custom useState hook that shares state globally across all components
 * Unlike React's useState, all instances of this hook share the same state
 */
export function useState<T>(initialValue?: T): [T, SetterFunction<T>] {
  // Initialize global state only on first hook usage
  if (state === undefined) {
    setState(initialValue);
  }

  // Subscribe to external state using React's useSyncExternalStore
  // - subscribe: tells React how to listen for state changes
  // - getSnapshot: tells React how to get current state value
  // React automatically handles re-rendering when the snapshot changes
  const snapshot = useSyncExternalStore(subscribe, () => state);

  // Create state setter that mimics React's useState behavior
  const setValue: SetterFunction<T> = (newValue) => {
    if (typeof newValue === 'function') {
      // Handle updater function: call it with current state to compute new value
      setState((newValue as (prevValue: T) => T)(state));
    } else {
      // Handle direct value: set it as the new state
      setState(newValue);
    }
  };

  return [snapshot, setValue];
}
