// On HMR (Hot Module Replacement), this module may be re-executed. To persist state across reloads:
// - Check if a store already exists on the global object (globalThis[__ASTAND__]).
// - If it does not exist, create and initialize a new store.
// - If it exists, reuse the existing store to preserve state and listeners across module reloads.
const GLOBAL_KEY = '__ASTAND__';

// Store structure for global state and listeners
// - state: array holding the global state values
// - listeners: set of functions to notify React when state might change
// - lastSnapshot: array to keep the last snapshot for comparison
//
// This enables state persistence across HMR reloads and module replacements.
type Store = {
  state: any[];
  listeners: Set<() => void>;
  lastSnapshot: any[];
};

function createInitialStore(): Store {
  return {
    state: [],
    listeners: new Set(),
    lastSnapshot: [],
  };
}

let store: Store;

// When the module is recreated by HMR, check if the store exists on the global object under __ASTAND__
// If it doesn't exist, create it and initialize its state property with the default store object.
// otherwise just assign the existing store to our local store variable.
if (!(GLOBAL_KEY in globalThis)) {
  (globalThis as any)[GLOBAL_KEY] = createInitialStore();
}
store = (globalThis as any)[GLOBAL_KEY];

export default store;
