import React, { useCallback, useEffect, useReducer, useRef } from 'react';

export interface SmartContext {
    subscribe: Function;
    getState: Function;
}

/**
 * Selects portions of state from a given context by using a selector function.
 * This hook is optimized to only rerender a component if the value returned by the selector has actually updated.
 * This gets rid of context always updating the whole tree of components under their provider.
 * @param context React context to select values from.
 * @param selector The selector function used to find the state data from the given context.
 * @returns The state data from the given context for the provided selector.
 */
export const useContextSelector = <T extends SmartContext, K>(
    context: React.Context<T>,
    selector: (state: any) => K
): K => {
    const [, forceRender] = useReducer((s) => s + 1, 0);
    const store = React.useContext(context);
    if (!store.getState()) {
        throw new Error(
            'The context provided to useContextSelector must be from within the appropriate provider. Check to make sure you wrapped your component in a Provider tag for the context which you are trying to use.'
        );
    }

    // Store a ref of our current selector so it can be used
    // within checkForUpdates without triggering an update to the callback itself
    const selectorRef = useRef(selector);
    selectorRef.current = selector;
    const selectedStateRef = useRef(selector(store.getState()));
    selectedStateRef.current = selector(store.getState());

    const checkForUpdates = useCallback(() => {
        // Compare new selected state to the last time this hook ran
        const newState = selectorRef.current(store.getState());
        // If new state differs from previous state, rerun this hook
        if (newState !== selectedStateRef.current) forceRender();
    }, [store]);

    // This effect should only run once on mount, since store should never change
    useEffect(() => {
        // Subscribe to store changes, call checkForUpdates when a change occurs
        const subscription = store.subscribe(checkForUpdates);
        return () => subscription();
    }, [store, checkForUpdates]);

    return selectedStateRef.current;
};
