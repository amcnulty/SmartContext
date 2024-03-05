import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { SmartContext } from '../types/types';

/**
 * This hook efficiently retrieves a portion of state from a smart context using a selector function.
 * It optimizes component re-renders by only triggering them when the selected value genuinely
 * changes, preventing unnecessary updates and enhancing performance.
 * @param context A React context instance created using `useSmartContext`
 * @param selector A function that takes the context state as input and returns the specific value or slice of state you want to access.
 * @returns The selected state value from the context, as determined by the provided selector function.
 *
 * @example
 * ```javascript
 * import { useContextSelector } from 'smart-context';
 * import { appContext, selectCount } from '../../context/AppContext';
 *
 * export const MyComponent = () => {
 *   // count will be returned with the type 'number' to match
 *   // the return type of the selectCount selector.
 *   const count = useContextSelector(appContext, selectCount);
 *
 *   return <div>Count: {count}</div>;
 * }
 * ```
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
