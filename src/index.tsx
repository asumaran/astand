import { useSyncExternalStore } from 'react';

// Global state variable shared across all useState hook instances
let state: any;
// Collection of listener functions that get called when state updates
let listeners = new Set<() => void>();

/**
 * Subscription function required by useSyncExternalStore
 * Registers a listener for state changes and returns cleanup function
 */
function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Internal function to update global state and notify subscribers
 * @param newPartialState - The new state value to replace current state
 */
function setState<T>(newPartialState: T) {
  // Replace entire state with new value (not merging)
  // TODO: Consider implementing shallow comparison to prevent unnecessary updates
  state = newPartialState;
  // Trigger re-render in all React components using this state
  listeners.forEach((listener) => listener());
}

// Type for setter function that accepts either direct value or updater function
type SetterFunction<T> = (newValue: T | ((prevValue: T) => T)) => void;

/**
 * Custom useState hook implementation using external state management
 * Note: All instances share the same global state
 */
export function useState<T>(initialValue?: T): [T, SetterFunction<T>] {
  // Initialize global state only on first hook usage
  if (state === undefined) {
    setState(initialValue);
  }

  // Connect to external state using React's useSyncExternalStore
  // This ensures React re-renders components when external state changes
  // The subscribe function tells React when to check for updates
  // The getSnapshot function () => state provides the current state value
  const snapshot = useSyncExternalStore(subscribe, () => state);

  // Create state setter that mimics React's useState behavior
  const setValue: SetterFunction<T> = (newValue) => {
    if (typeof newValue === 'function') {
      // Handle updater function: call it with current state to get new value
      setState((newValue as (prevValue: T) => T)(state));
    } else {
      // Handle direct value: set it as new state
      setState(newValue);
    }
  };

  return [snapshot, setValue];
}
